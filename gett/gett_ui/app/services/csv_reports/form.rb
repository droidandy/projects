module CsvReports
  class Form < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context

    attributes :csv_report

    def self.policy_class
      CsvReports::Policy
    end

    def execute!
      {
        csv_report: csv_report_data,
        recurrence_options: %w(monthly weekly daily)
      }
    end

    private def csv_report_data
      return { recurrence: 'monthly', delimiter: ',' } if csv_report.blank?

      csv_report.to_hash.tap do |hash|
        hash[:headers].transform_values! { |value| DB.typecast_value(:boolean, value) }
      end
    end
  end
end
