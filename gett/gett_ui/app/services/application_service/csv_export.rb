require 'csv'

module ApplicationService::CsvExport
  def to_csv(collection)
    CSV.generate do |csv|
      csv << csv_headers.values
      collection.each{ |hash| csv << csv_headers.keys.map{ |h| hash[h] } }
    end
  end

  private def csv_headers
    fail "csv_headers should be defined on receiver for CSV data generation"
  end
end
