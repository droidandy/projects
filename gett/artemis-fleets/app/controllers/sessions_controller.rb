class SessionsController < ApplicationController
  skip_before_action :authenticate, only: :create

  def current
    render json: {
      id: current_user.id,
      email: current_user.email,
      realm: current_user.realm,
      role: current_user.role
    }
  end

  def create
    service = Sessions::Create.new(user_params)
    service.execute!

    if service.success
      render json: service.result
    else
      render json: { error: service.error }, status: :unauthorized
    end
  end

  private def user_params
    params.require(:user).permit(:email, :password)
  end
end
