require 'json_web_token'

class UsersController < ApplicationController
  skip_before_action :authenticate, only: %i(forgot_password reset_password check_token)

  def forgot_password
    Users::ForgotPassword.new(params[:email]).execute!
    head :ok
  end

  def check_token
    service = Users::CheckToken.new(params[:reset_password_token])
    service.execute!
    status = service.valid ? :ok : :not_found
    render status: status, json: {valid: service.valid}
  end

  def reset_password
    service = Users::ResetPassword.new(reset_password_params)
    service.execute!
    if service.success
      user = service.user
      render json: {token: JsonWebToken.encode(id: user.id), realm: user.realm}
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  def update_password
    service = Users::UpdatePassword.new(current_user, update_password_params)
    service.execute!

    if service.success
      head :ok
    else
      render json: {errors: service.errors}, status: :unprocessable_entity
    end
  end

  private def reset_password_params
    params.permit(:reset_password_token, :password, :password_confirmation)
  end

  private def update_password_params
    params.permit(:current_password, :password, :password_confirmation)
  end
end
