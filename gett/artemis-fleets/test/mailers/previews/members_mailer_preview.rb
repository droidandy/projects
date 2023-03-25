class MembersMailerPreview < ActionMailer::Preview
  def invitation
    member = Member.first
    member.reset_password_token!
    MembersMailer.invitation(member.id)
  end
end
