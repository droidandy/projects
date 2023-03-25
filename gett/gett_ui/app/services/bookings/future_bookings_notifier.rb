module Bookings
  class FutureBookingsNotifier < ApplicationService
    include ApplicationService::Context
    include ApplicationService::FutureBookingsMethods

    attributes :booking

    def execute!
      return if member.blank?

      result do
        Faye.notify(
          channel,
          future_bookings_count: future_bookings_count,
          closest_future_booking_id: closest_future_booking_id
        )
      end
    end

    private def channel
      "active-bookings-info-#{member.id}"
    end

    private def member
      booking.passenger
    end
  end
end
