class MembersMailer < ApplicationMailer
  def invitation(member_id)
    @member = Member.find(member_id)
    mail to: @member.email, subject: 'Invitation'
  end
end
