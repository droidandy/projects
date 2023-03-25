module CsvReports
  class Update < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    attributes :csv_report, :params
    delegate :errors, to: :csv_report

    def self.policy_class
      CsvReports::Policy
    end

    def execute!
      result { update_model(csv_report, params.to_h) }

      reschedule_sender_job if success?
    end

    def show_result
      CsvReports::Show.new(csv_report: csv_report).execute.result
    end

    private def reschedule_sender_job
      csv_report.scheduled_jobs.each(&:delete)
      CsvReportSender.perform_at(csv_report.next_occurrence, csv_report.id)
    end
  end
end
