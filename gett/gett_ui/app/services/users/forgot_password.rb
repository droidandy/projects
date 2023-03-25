module Users
  class ForgotPassword < ApplicationService
    attributes :email

    def execute!
      return if user.blank?

      result do
        user.set_reset_password_token! if !user.member? || user.active?
      end

      send_instructions_email if success?
    end

    private def send_instructions_email
      UsersMailer.reset_password(user.id).deliver_later
    end

    def user
      return @user if defined? @user

      @user = User.first(email: email.downcase)
    end
  end
end
