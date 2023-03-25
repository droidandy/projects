module Bookings
  class Timeline < ApplicationService
    attributes :booking

    def execute!
      booking_data.merge(events: events)
    end

    private def booking_data
      booking.as_json(
        only: [:id, :service_id, :status, :travel_distance],
        include: [:service_type, :indicated_status]
      )
    end

    private def events
      Bookings::Events.new(booking: booking).execute.result
    end
  end
end
