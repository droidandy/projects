class SupportRequestsMailer < ApplicationMailer
  def contact_us(user, message)
    @user = user
    @message = message
    mail to: Rails.application.secrets.contact_us_email, subject: "Support Request from #{user.name}"
  end
end
