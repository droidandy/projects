module Statements
  class Parser
    attr_reader :data

    def initialize(data)
      @data = data
    end

    def parse
      {
        adjustments: data.dig('summary', 'adjustments').to_f,
        cash:        data.dig('summary', 'cash_fare').to_f,
        commission:  data.dig('totals', 'commission').to_f,
        earnings:    data.dig('summary', 'earnings').to_f,
        fees:        data.dig('summary', 'fees').to_f,
        from:        Time.zone.parse(data['period_from']).iso8601,
        id:          data['id'],
        rides:       data.dig('summary', 'fare').to_f,
        tips:        data.dig('summary', 'tips').to_f,
        to:          Time.zone.parse(data['period_to']).iso8601,
        total:       data.dig('summary', 'final_payment').to_f,
        vat:         data.dig('totals', 'vat').to_f,
        week_number: Time.zone.parse(data['period_from']).to_date.cweek
      }
    end
  end
end
