module Mobile::V1
  module Sessions
    class Show < ::Sessions::Current
      include ApplicationService::FutureBookingsMethods

      def self.policy_class
        ::Sessions::CurrentPolicy
      end

      def execute!
        super.merge(
          active_booking_id: last_active_booking_id,
          future_bookings_count: future_bookings_count,
          closest_future_booking_id: closest_future_booking_id
        )
      end
    end
  end
end
