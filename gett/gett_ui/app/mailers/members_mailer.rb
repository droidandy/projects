class MembersMailer < ApplicationMailer
  default from: GETT_BUSINESS_SOLUTIONS

  def invitation(user_id)
    @user            = Member.with_pk!(user_id)
    company          = @user.company
    @admin_full_name = company.primary_contact&.full_name.presence || company.admin.full_name

    @user.add_change(:invitation, 'Has been invited')
    mail to: @user.email, subject: "#{@user.full_name}, Welcome to Gett Business Solutions powered by One Transport"
  end

  def admin_invitation(user_id)
    @user = Member.with_pk!(user_id)
    @extra_footer_block = :download_ot_app if @user.company.exactly_enterprise?

    @user.add_change(:invitation, 'Has been invited')
    mail to: @user.email, subject: "#{@user.full_name}, Welcome to Gett Business Solutions powered by One Transport"
  end
end
