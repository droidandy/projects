# Preview all emails at http://localhost:3000/rails/mailers/users
class UsersMailerPreview < ActionMailer::Preview
  def reset_password
    UsersMailer.reset_password(User.first, 'token')
  end

  def invite
    UsersMailer.invite(User.first, 'token')
  end

  def approval
    UsersMailer.approval(User.first, FFaker::HTMLIpsum.p)
  end
end
