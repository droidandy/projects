module Bookings
  class Show < Shared::Bookings::Show
    include ApplicationService::Context
    include ApplicationService::Policy

    delegate :member, to: :context

    def execute!
      super.deep_merge(
        rateable: rate_service.booking_rateable?,
        cancellation_reasons: Booking::CANCELLATION_REASONS,
        can: {
          edit: booking.editable?,
          see_logs: false
        }
      )
    end

    private def rate_service
      @rate_service ||= Rate.new(booking: booking)
    end

    private def skip_sanitize
      member&.id == booking.passenger_id
    end
  end
end
