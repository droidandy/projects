module CsvReports
  class Index < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context

    delegate :company, to: :context

    def self.policy_class
      CsvReports::Policy
    end

    def execute!
      company.csv_reports.map do |csv_report|
        CsvReports::Show.new(csv_report: csv_report).execute.result
      end
    end
  end
end
