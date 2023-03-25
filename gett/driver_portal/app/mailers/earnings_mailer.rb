class EarningsMailer < ApplicationMailer
  def report(user, csv)
    @user = user
    attachments['earnings.csv'] = { mime_type: 'text/csv', content: csv }
    mail to: @user.email, subject: 'Your file from Gett'
  end

  def share(user, csv, emails, body)
    @user = user
    @body = body
    attachments['earnings.csv'] = { mime_type: 'text/csv', content: csv }
    mail to: emails, subject: "You have been sent a file from Gett "
  end
end
