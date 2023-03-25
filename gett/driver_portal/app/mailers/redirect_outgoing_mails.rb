class RedirectOutgoingMails
  class << self
    def delivering_email(mail)
      emails = Rails.application.secrets.redirect_emails_to
      mail.to = emails if emails
    end
  end
end
