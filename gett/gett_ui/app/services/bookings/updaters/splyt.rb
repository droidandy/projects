module Bookings
  module Updaters
    class Splyt < Bookings::Updaters::Base
      def can_execute?
        booking.splyt? && booking.service_id.present?
      end

      private def update_params
        api_service.booking_params
      end

      private def request_api_service
        api_service.with_context(company: booking.company).execute
      end

      private def api_service
        @api_service ||= ::Splyt::Update.new(booking: booking)
      end

      private def update_booking_charges
        nil
      end
    end
  end
end
