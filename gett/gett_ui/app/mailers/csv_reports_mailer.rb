class CsvReportsMailer < ApplicationMailer
  def report(csv_report_id, recipient_email, csv_attachment)
    @csv_report = CsvReport.with_pk!(csv_report_id)
    @user = Member.first(email: recipient_email) || Hashie::Mash.new(enterprise: true)
    @thank_you = true

    attachments["#{@csv_report.recurrence}_report.csv"] = csv_attachment

    mail to: recipient_email,
      subject: "Your #{@csv_report.recurrence.capitalize} Gett Business Solutions powered by One Transport Rides CSV file"
  end
end
