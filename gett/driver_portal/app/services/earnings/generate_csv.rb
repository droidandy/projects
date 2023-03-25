require 'csv'

module Earnings
  class GenerateCSV < ApplicationService
    attr_reader :csv

    COLUMNS = {
      order_id: 'Order ID',
      transaction_type: 'Earning type',
      issued_at: 'Date and time',
      origin: 'Pickup address',
      destination: 'Destination address',
      taxi_fare: 'Base fare',
      gratuity: 'Tips',
      extras: 'Extras',
      cancellation_fee: 'Cancellation fee',
      vat: 'VAT',
      commission: 'Commission',
      waiting: 'Waiting time cost',
      peak_hour_premium: 'Peak Hour Premium',
      total: 'Total'
    }.freeze

    schema do
      required(:driver).filled
      required(:from).filled(:date_time?)
      required(:to).filled(:date_time?)
      optional(:external_ids).maybe(:array?)
    end

    def execute!
      @csv = generate_csv
      success! if @csv
    end

    private def generate_csv
      return unless filtered_earnings

      CSV.generate(headers: true) do |csv|
        csv << COLUMNS.values

        filtered_earnings.each do |earning|
          earning[:transaction_type] = earning.dig(:transaction_type, :name)
          earning[:origin] = earning.dig(:origin, :full_address)
          earning[:destination] = earning.dig(:destination, :full_address)
          csv << COLUMNS.keys.map { |attr| earning[attr] }
        end
      end
    end

    private def filtered_earnings
      compose(Earnings::List.new(current_user, @args), :earnings)
      return unless @earnings

      ids = Array.wrap(external_ids)
      if ids.any?
        @earnings.select { |earning| ids.include?(earning[:external_id]) }
      else
        @earnings
      end
    end
  end
end
