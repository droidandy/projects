require 'session'

module Sessions
  class Create < ApplicationService
    attr_reader :session

    schema do
      required(:email).filled(:str?)
      required(:password).filled(:str?)
    end

    def initialize(args = {})
      super(nil, args)
    end

    def execute!
      unless authenticated?
        fail!(errors: { base: I18n.t('errors.invalid_email_or_password') })
        return
      end

      unless user.active?
        fail!(errors: { base: I18n.t('errors.account_deactivated') })
        return
      end

      compose(Agents::ChangeStatus.new(user, status: 'busy')) if user.onboarding_agent?

      success!
    end

    on_success :create_session
    on_success :create_login

    private def authenticated?
      current_user.blank? && user && user.authenticate(password)
    end

    private def user
      @user ||= User.find_by(email: User.normalized_email(email))
    end

    private def create_session
      @session = Session.new(access_token)
      @session.touch # rubocop:disable Rails/SkipsModelValidations
    end

    private def create_login
      login = user.logins.create
      Statistics::Record.new(system_user, type: :login_count).execute! if login.valid?
    end

    private def access_token
      Session.encoded_user(user)
    end
  end
end
