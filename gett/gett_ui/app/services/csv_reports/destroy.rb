module CsvReports
  class Destroy < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    attributes :csv_report

    def self.policy_class
      CsvReports::Policy
    end

    def execute!
      result { destroy_model(csv_report) }

      csv_report.scheduled_jobs.each(&:delete) if success?
    end
  end
end
