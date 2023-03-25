class StatementsMailer < ApplicationMailer
  def report(user, zip)
    @user = user
    attachments['statements.zip'] = { mime_type: 'application/zip', content: zip }
    mail to: @user.email, subject: 'Your statement from Gett'
  end

  def share(user, zip, emails, body)
    @user = user
    @body = body
    attachments['statements.zip'] = { mime_type: 'application/zip', content: zip }
    mail to: emails, subject: "You have been sent a statement from Gett "
  end
end
