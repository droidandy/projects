module Incomings
  module GetE
    class TripPositionUpdateHandler < Base
      def execute!
        super do
          Bookings::DriverUpdater.new(booking: booking, params: driver_params).execute
        end
      end

      private def validate
        errors.add(:booking, :not_found) if booking.blank?
      end

      private def driver_params
        driver = payload[:data][:Driver]
        driver_location = driver[:Location]
        {
          name: driver[:Name],
          phone_number: driver[:Phone],
          lat: driver_location[:Latitude],
          lng: driver_location[:Longitude]
        }
      end
    end
  end
end
