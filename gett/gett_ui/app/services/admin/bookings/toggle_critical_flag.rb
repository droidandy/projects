module Admin::Bookings
  class ToggleCriticalFlag < ::Bookings::Row
    attributes :booking

    def execute!
      booking.update(critical_flag: !booking.critical_flag)
    end

    def show_result
      Show.new(booking: booking).execute.result
    end
  end
end
