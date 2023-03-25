module Bookings
  module Updaters
    class Gett < Bookings::Updaters::Base
      STATUS_MAPPING = {
        'Pending'   => :order_received,
        'Routing'   => :locating,
        'CareReq'   => :locating,
        'Confirmed' => :on_the_way,
        'Waiting'   => :arrived,
        'Driving'   => :in_progress,
        'Complete'  => :completed,
        'Completed' => :completed,
        'Canceled'  => :cancelled,
        'Cancelled' => :cancelled,
        'Rejected'  => :rejected
      }.freeze
      private_constant :STATUS_MAPPING

      UPDATE_CHARGES_DELAY = 10.minutes.freeze

      def can_execute?
        booking.gett?
      end

      private def booking_params
        {status: STATUS_MAPPING[api_service.normalized_response[:status]]}
      end

      private def request_api_service
        api_service.with_context(company: booking.company).execute
      end

      private def api_service
        @api_service ||= ::Gett::Ride.new(booking: booking)
      end

      private def update_booking_charges
        BookingsChargesUpdater.perform_in(UPDATE_CHARGES_DELAY, booking.id)
      end
    end
  end
end
