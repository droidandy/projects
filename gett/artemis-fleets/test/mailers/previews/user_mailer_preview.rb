class UserMailerPreview < ActionMailer::Preview
  def reset_password
    UsersMailer.reset_password(User.first.id)
  end
end
