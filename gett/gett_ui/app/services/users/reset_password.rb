module Users
  class ResetPassword < ApplicationService
    include ApplicationService::ModelMethods

    attributes :params, :log_in

    def execute!
      return set_errors(user: ['unrecognized token']) if user.blank?

      update_model(user, user_params, {
        reset_password_token: nil,
        reset_password_sent_at: nil
      }, log_in && {
        last_logged_in_at: Time.current,
        login_count: user.login_count + 1
      })
    end

    def errors
      @errors || user.errors
    end

    def user
      return @user if defined? @user

      token = params[:reset_password_token]
      @user = User.first(reset_password_token: token) if token.present?
    end

    private def user_params
      params.slice(:password, :password_confirmation)
    end
  end
end
