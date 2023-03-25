class UsersPreview < ActionMailer::Preview
  def reset_password
    user = User.first(email: 'reset_password@fakemail.com')
    user.set_reset_password_token!

    UsersMailer.reset_password(user.id)
  end
end
