module Mobile::V1
  module Passengers
    class Form < ::Passengers::Form
      def self.policy_class
        ::Passengers::FormPolicy
      end

      private def present_passenger_data
        super.merge!(default_phone_type: passenger.default_phone_type)
      end
    end
  end
end
