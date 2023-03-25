# Service for basic processing of booking attributes
# currently it is just stub
module Bookings::FormProcessors
  class General < Base
    def execute!
      validate_flight if booking_params[:flight].present?

      super
    end

    private def validate_flight
      return if flight_info.values.all?(&:present?)

      add_error(:flight, I18n.t('booking.errors.invalid_journey_flight'))
    end

    private def pickup_points
      [booking_params[:pickup_address]]
        .concat(booking_params.dig(:stops)&.pluck(:address) || [])
        .compact
    end

    def flight_info
      @flight_info ||=
        Bookings::FlightInfo.new(
          flight:           booking_params[:flight],
          scheduled_at:     scheduled_at,
          pickup_iata:      pickup_points.pluck(:airport).compact,
          destination_iata: booking_params.dig(:destination_address, :airport)
        ).execute.result
    end
  end
end
