class AuthenticatedController < ActionController::API
  before_action :authenticate

  rescue_from ApplicationService::NotAuthorizedError, with: :user_not_authorized

  def current_user
    return @current_user if defined?(@current_user)

    @current_user = user_from_token
  end

  def current_member
    return @current_member if defined?(@current_member)

    @current_member = encoded_token.presence && decoded_token.presence &&
      Member.active.with_active_company[decoded_token[:reincarnated_as] || decoded_token[:id]]
  end

  def current_admin
    current_user if current_user&.back_office?
  end

  protected def authenticate
    head :unauthorized if current_user.blank? || (current_user.member? && !current_user.active?)
  end

  private def user_from_token
    return if encoded_token.blank? || decoded_token.blank?

    User[decoded_token[:id]]
  end

  private def encoded_token
    return @encoded_token if defined?(@encoded_token)

    @encoded_token =
      if request.headers['Authorization'].present?
        request.headers['Authorization'].split(' ').last
      else
        params[:token]
      end
  end

  private def decoded_token
    @decoded_token ||= JsonWebToken.decode(encoded_token)
  end

  private def user_not_authorized
    head :unauthorized
  end
end
