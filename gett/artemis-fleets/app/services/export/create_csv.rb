require 'csv'

module Export
  class CreateCsv
    def initialize(remote_records, csv_headers)
      @remote_records = remote_records
      @csv_headers = csv_headers
    end

    attr_reader :result

    def execute!
      @result = to_csv
    end

    private def to_csv
      CSV.generate do |csv|
        csv << @csv_headers
        @remote_records.each do |hash|
          csv << hash.with_indifferent_access.values_at(*@csv_headers)
        end
      end
    end
  end
end
