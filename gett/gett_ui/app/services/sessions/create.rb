require 'json_web_token'

class Sessions::Create < ApplicationService
  include ApplicationService::ModelMethods

  ALLOWED_REGULAR_LOGIN_ATTEMPTS = 10
  ALLOWED_CAPTCHA_LOGIN_ATTEMPTS = 10
  USER_LOCK_PERIOD               = 30.minutes.freeze
  MOBILE_API_TYPE                = 'mobile'.freeze

  private_constant :ALLOWED_REGULAR_LOGIN_ATTEMPTS,
    :ALLOWED_CAPTCHA_LOGIN_ATTEMPTS,
    :USER_LOCK_PERIOD

  delegate :site_key, to: 'Settings.google_recaptcha'

  attributes :params, :api_type

  def execute!
    if user.blank?
      set_invalid_credentials_errors
    elsif user.locked?
      set_errors(I18n.t('services.sessions.errors.locked_user'))
    elsif captcha_required? && captcha_response.blank?
      { show_captcha: true, site_key: site_key }
    elsif captcha_required? && !captcha_response_valid?
      set_errors(I18n.t('services.sessions.errors.invalid_captcha'))
    elsif !user.authenticate(password)
      handle_invalid_password_login_attempt
      set_invalid_credentials_errors
    elsif user.member? && !user.company.active?
      set_errors(I18n.t('services.sessions.errors.company_deactivated'))
    elsif user.member? && !user.active?
      set_errors(I18n.t('services.sessions.errors.account_deactivated'))
    elsif user.member? && from_mobile_app? && !from_bbc_app? && user.company.bbc?
      set_errors(I18n.t('services.sessions.errors.use_bbc_mobile_app'))
    elsif user.member? && from_mobile_app? && from_bbc_app? && !user.company.bbc?
      set_errors(I18n.t('services.sessions.errors.use_generic_mobile_app'))
    elsif user.member? && from_mobile_app? && user.company.affiliate?
      set_errors(I18n.t('services.sessions.errors.affiliate_mobile_app_acces_denied'))
    else
      log_in_user
    end
  end

  private def user
    return @user if defined? @user

    @user = email.presence && User.first(email: email)
  end

  private def email
    params[:email].to_s.strip.downcase
  end

  private def password
    params[:password]
  end

  private def captcha_response
    params[:captcha_response]
  end

  private def app_type
    params[:app_type]
  end

  private def captcha_required?
    !from_mobile_app? && user.invalid_passwords_count >= ALLOWED_REGULAR_LOGIN_ATTEMPTS
  end

  private def captcha_response_valid?
    # NOTE: this service should be called only once as after first request Google marks
    # captcha_response as expired and it becomes invalid
    GoogleRecaptcha::ValidateResponse.new(captcha_response: captcha_response).execute.success?
  end

  private def handle_invalid_password_login_attempt
    if allowed_login_attempts_count_exceeded?
      lock_user
    else
      increment_invalid_passwords_count
    end
  end

  private def next_invalid_passwords_count
    user.invalid_passwords_count + 1
  end

  private def allowed_login_attempts_count_exceeded?
    next_invalid_passwords_count >= ALLOWED_REGULAR_LOGIN_ATTEMPTS + ALLOWED_CAPTCHA_LOGIN_ATTEMPTS
  end

  private def lock_user
    increment_invalid_passwords_count(
      locked: true,
      locks_count: user.locks_count + 1
    )
    UserUnlocker.perform_in(USER_LOCK_PERIOD, user.id)
  end

  private def increment_invalid_passwords_count(params = {})
    update_model(user, params.merge(invalid_passwords_count: next_invalid_passwords_count))
  end

  private def from_mobile_app?
    api_type == MOBILE_API_TYPE
  end

  private def from_bbc_app?
    app_type == 'bbc'
  end

  private def log_in_user
    send_bbc_notification_and_email if user.member? && user.company.bbc?

    update_model(user,
      last_logged_in_at: Time.current,
      login_count: user.login_count + 1,
      reset_password_token: nil,
      reset_password_sent_at: nil,
      invalid_passwords_count: 0
    )
    @result = { token: JsonWebToken.encode(id: user.id), realms: user.realms }
  end

  private def send_bbc_notification_and_email
    # we need to send notification only one time per 24 hours
    return if user.last_logged_in_at.present? && user.last_logged_in_at < 1.day.ago
    return unless user.pd_expired?

    Messages::CreatePersonal.new(
      recipient: user,
      message_body: I18n.t('bbc.passenger_notifications.pd_unsigned')
    ).execute
    BbcNotificationsMailer.please_update_pd(passenger: user).deliver_later
  end

  private def set_invalid_credentials_errors
    set_errors(I18n.t('services.sessions.errors.invalid_credentials'))
  end
end
