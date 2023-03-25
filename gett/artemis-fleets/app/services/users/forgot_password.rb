module Users
  class ForgotPassword
    def initialize(email)
      @email = email
    end

    def execute!
      user = User.find_by(email: @email) || return
      user.reset_password_token!
      UsersMailer.reset_password(user.id).deliver_now
    end
  end
end
