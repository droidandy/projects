module Incomings
  class AuthController < ActionController::API
    before_action :authenticate

    protected def authenticate
      render json: error_response, status: :unauthorized unless authenticated?
    end

    private def authenticated?
      return false if api_token.blank?

      Rack::Utils.secure_compare(api_token, access_token)
    end

    private def api_token
      request.headers[:Authorization]
    end

    private def access_token
      ''
    end

    private def success_response
      { message: 'OK' }
    end

    private def error_response
      { message: 'Failure' }
    end
  end
end
