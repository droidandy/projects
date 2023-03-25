class UsersMailer < ApplicationMailer
  def reset_password(user_id)
    @user = User.with_pk!(user_id)
    @extra_footer_block = :download_ot_app if @user.try(:company)&.exactly_enterprise?

    mail to: @user.email, subject: "Reset password instruction"
  end
end
