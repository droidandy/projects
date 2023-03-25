class UsersMailer < ApplicationMailer
  def reset_password(user, token)
    @user = user
    @token = token
    mail to: @user.email, subject: 'Reset password instructions'
  end

  def invite(user, token)
    @user = user
    @token = token
    mail to: @user.email, subject: 'Invitation to driver portal'
  end

  def approval(user, subject, message)
    @user = user
    @message = message
    mail to: @user.email, subject: subject
  end
end
