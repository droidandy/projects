module CsvReports
  class Show < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context

    attributes :csv_report

    def self.policy_class
      CsvReports::Policy
    end

    def execute!
      csv_report.as_json(only: [:id, :name, :recurrence])
    end
  end
end
