module Earnings
  class Parser
    attr_reader :data

    def initialize(data)
      @data = data
    end

    def parse
      {
        external_id: data['external_id'],
        order_id: data['order_id'],
        origin: location_data('origin'),
        destination: location_data('destination'),
        taxi_fare: amount('driving'),
        cancellation_fee: amount('cancellation'),
        gratuity: amount('tips'),
        commission: commissions.sum { |commission| commission['amount_inc_tax'].to_f },
        extras: extras.sum { |extra| extra['amount_inc_tax'].to_f },
        peak_hour_premium: amount('additional_fee'),
        waiting: amount('waiting'),
        total: total.round(2),
        vat: vat.round(2),
        journey_time: journey_time,
        started_at: started_at&.iso8601,
        status: data.dig('metadata', 'order', 'status'),
        issued_at: issued_at&.iso8601,
        transaction_type: data['transaction_type']&.slice('name', 'slug')&.symbolize_keys
      }
    end

    private def amount(type)
      data.dig('metadata', 'bookkeeping_details', 'supplier', type, 'amount').to_f
    end

    LOCATION_ATTRIBUTES = %w[full_address latitude longitude].freeze

    private def location_data(location_type)
      data.dig('metadata', 'order', location_type)&.slice(*LOCATION_ATTRIBUTES)&.symbolize_keys
    end

    COMMISSION_SLUG = 'order_commission'.freeze

    private def commissions
      related_transactions.select do |transaction|
        transaction.dig('transaction_type', 'slug') == COMMISSION_SLUG
      end
    end

    private def extras
      related_transactions.reject do |transaction|
        transaction.dig('transaction_type', 'slug') == COMMISSION_SLUG
      end
    end

    private def total
      related_total = related_transactions.sum { |rel| rel['amount_inc_tax'].to_f }
      related_total + data['amount_inc_tax'].to_f
    end

    private def vat
      related_diff = related_transactions.sum do |rel|
        rel['amount_inc_tax'].to_f.abs - rel['amount_exc_tax'].to_f.abs
      end
      related_diff + (data['amount_inc_tax'].to_f.abs - data['amount_exc_tax'].to_f.abs)
    end

    private def related_transactions
      @related_transactions ||= data['related_transactions'] || []
    end

    private def journey_time
      (ended_at - started_at).to_i if started_at && ended_at
    end

    private def started_at
      time = data.dig('metadata', 'bookkeeping_details', 'started_at')
      Time.zone.parse(time) if time
    end

    private def ended_at
      time = data.dig('metadata', 'bookkeeping_details', 'ended_at')
      Time.zone.parse(time) if time
    end

    private def issued_at
      time = data['issued_at']
      Time.zone.parse(time) if time
    end
  end
end
