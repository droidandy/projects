module Incomings
  module GetE
    class DriverUpdateHandler < Base
      def execute!
        super do
          Bookings::DriverUpdater.new(booking: booking, params: driver_params).execute
        end
      end

      private def validate
        errors.add(:booking, :not_found) if booking.blank?
      end

      private def driver_params
        {
          name: payload.dig('data', 'Driver', 'Name'),
          phone_number: payload.dig('data', 'Driver', 'Phone')
        }
      end
    end
  end
end
