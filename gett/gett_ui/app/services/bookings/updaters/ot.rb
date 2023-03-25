module Bookings
  module Updaters
    class OT < Bookings::Updaters::Base
      JOB_STATUSES_MAPPING = {
        'Prebooked' => :order_received,
        'Completed' => :completed,
        'Cancelled' => :cancelled
      }.freeze

      VEHICLE_STATES_MAPPING = {
        'Free'      => :locating,
        'Offline'   => :locating,
        'Allocated' => :on_the_way,
        'Arrived'   => :arrived,
        'POB'       => :in_progress,
        'Busy'      => :locating,
        'Completed' => :completed,
        'Cancelled' => :cancelled,
        'None'      => :order_received
      }.freeze

      STATUSES_UPDATE_OFFSET = {
        on_the_way: 1.hour.freeze,
        arrived: 45.minutes.freeze
      }.freeze

      PROCESSING_DELAY = 30.seconds.freeze
      private_constant :JOB_STATUSES_MAPPING, :VEHICLE_STATES_MAPPING, :PROCESSING_DELAY, :STATUSES_UPDATE_OFFSET

      def can_execute?
        booking.ot? && booking.booked_at.present? && (Time.current - booking.booked_at > PROCESSING_DELAY)
      end

      private def booking_params
        return {} if suppress_status_update?

        {status: resolved_status, ot_vehicle_state: vehicle_state}
      end

      private def resolved_status
        JOB_STATUSES_MAPPING[booking.ot_job_status] || VEHICLE_STATES_MAPPING[vehicle_state] || booking.status
      end

      private def vehicle_state
        @vehicle_state ||= api_service.normalized_response[:vehicle_state]
      end

      private def request_api_service
        api_service.execute
      end

      private def api_service
        @api_service ||= OneTransport::VehicleLocation.new(external_reference: booking.service_id)
      end

      private def pay_for_booking!
        fail_safe { BookingPayments::Create.new(booking: booking).execute }
      end

      private def suppress_status_update?
        STATUSES_UPDATE_OFFSET.key?(resolved_status) &&
          booking.scheduled_at > STATUSES_UPDATE_OFFSET[resolved_status].from_now
      end
    end
  end
end
