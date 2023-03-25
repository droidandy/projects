module Mobile::V1
  class SessionsController < ApplicationController
    skip_before_action :authenticate, only: :create

    def show
      render json: Mobile::V1::Sessions::Show.new(member: current_member, user: current_user).execute.result
    end

    def create
      service = ::Sessions::Create.new(params: user_params, api_type: ::Sessions::Create::MOBILE_API_TYPE)

      if service.execute.success?
        render json: service.result
      else
        render json: {error: service.errors}, status: :unauthorized
      end
    end

    private def user_params
      params.fetch(:user, {}).permit(:email, :password, :captcha_response, :app_type)
    end
  end
end
