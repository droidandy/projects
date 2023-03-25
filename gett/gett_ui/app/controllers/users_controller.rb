require 'json_web_token'

class UsersController < ApplicationController
  skip_before_action :authenticate

  def forgot_password
    Users::ForgotPassword.new(email: params[:email]).execute

    head :ok
  end

  def reset_password
    service = Users::ResetPassword.new(params: reset_password_params)

    if service.execute(log_in: true).success?
      user = service.user
      render json: {token: JsonWebToken.encode(id: user.id), realm: user.realm}
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def update_password
    service = Users::UpdatePassword.new(params: update_password_params)

    if service.execute.success?
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  private def reset_password_params
    params.require(:user).permit(:reset_password_token, :password, :password_confirmation)
  end

  private def update_password_params
    params.require(:user).permit(:current_password, :password, :password_confirmation)
  end
end
