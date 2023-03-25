class CsvReportSender < ApplicationWorker
  sidekiq_options queue: :default

  def perform(csv_report_id)
    csv_report = CsvReport.with_pk!(csv_report_id)
    csv_attachment ||= CsvReports::Export.new(csv_report: csv_report).execute.result

    csv_report.recipient_emails.each do |recipient_email|
      CsvReportsMailer.report(csv_report_id, recipient_email, csv_attachment).deliver
    end

    self.class.perform_at(csv_report.next_occurrence, csv_report_id)
  end
end
