module Mobile::V1
  module Bookings
    class Show < ::Bookings::Show
      def self.policy_class
        ::Bookings::ShowPolicy
      end

      private def execute!
        super.merge(service_id: booking.order_id)
      end

      private def pickup_address
        super.merge!(airport: booking.pickup_address.airport&.iata)
      end

      private def destination_address
        super&.merge!(airport: booking.destination_address&.airport&.iata)
      end

      private def stop_addresses
        booking.stop_addresses.map do |address|
          address.as_json(only: address_json_fields).merge(
            'airport' => address.airport&.iata,
            'name'    => address[:stop_info]['name'],
            'phone'   => address[:stop_info]['phone']
          )
        end
      end

      private def address_json_fields
        [:line, :lat, :lng, :postal_code, :country_code, :timezone, :city]
      end
    end
  end
end
