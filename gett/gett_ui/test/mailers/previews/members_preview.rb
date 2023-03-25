class MembersPreview < ActionMailer::Preview
  def invitation
    member = Member.first(email: 'aa@a.aaa')
    member.set_reset_password_token!

    MembersMailer.invitation(member.id)
  end
end
