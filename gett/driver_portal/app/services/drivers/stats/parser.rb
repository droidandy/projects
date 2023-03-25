module Drivers
  module Stats
    class Parser
      attr_reader :data

      def initialize(data)
        @data = data
      end

      def parse
        {
          account_fare:     data.dig('current_week', 'account_fare').to_f,
          cancelled_orders: data.dig('current_week', 'cancelled_orders'),
          card_fare:        data.dig('current_week', 'card_fare').to_f,
          cash_fare:        data.dig('current_week', 'cash_fare').to_f,
          completed_orders: data.dig('current_week', 'completed_orders'),
          tips:             data.dig('current_week', 'tips').to_f
        }
      end
    end
  end
end
