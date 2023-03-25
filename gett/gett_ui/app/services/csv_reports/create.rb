module CsvReports
  class Create < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    attributes :params
    delegate :errors, to: :csv_report
    delegate :company, to: :context

    def self.policy_class
      CsvReports::Policy
    end

    def execute!
      result { create_model(csv_report, params.to_h) }

      if success?
        CsvReportSender.perform_at(csv_report.next_occurrence, csv_report.id)
      end
    end

    def show_result
      CsvReports::Show.new(csv_report: csv_report).execute.result
    end

    def csv_report
      @csv_report ||= CsvReport.new(company: company)
    end
  end
end
