module Documents
  class InvoiceBookingDecorator
    include HomePrivacy::AddressHelpers
    DATE_FORMAT = '%d.%m.%Y'.freeze
    TIME_FORMAT = '%l:%M %P'.freeze

    attr_reader :booking

    def initialize(booking)
      @booking = booking
    end

    # NOTE: `:order_id` and `:passenger_name` delegations are used in
    # `app/views/documents/invoice_bookings.html.haml`
    delegate :charges, :order_id, :passenger_name, to: :booking
    delegate :vatable_ride_fees, :non_vatable_ride_fees,
      :vatable_extra_fees, :non_vatable_extra_fees,
      :service_fees, :total_cost, :vat,
      to: :charges

    def scheduled_at_in_time_zone
      booking.scheduled_at.in_time_zone(booking.timezone)
    end

    def scheduled_at_date
      scheduled_at_in_time_zone.strftime(DATE_FORMAT)
    end

    def scheduled_at_time
      scheduled_at_in_time_zone.strftime(TIME_FORMAT)
    end

    def references
      booking.booker_references.map do |reference|
        "#{reference.booking_reference_name}: #{reference.value}"
      end.join(', ')
    end

    def waypoints
      [
        booking.pickup_address,
        *booking.stop_addresses,
        booking.destination_address
      ].compact.map(&method(:format_waypoint))
    end

    def format_waypoint(address)
      safe_line = safe_address_line(address)
      return safe_line if safe_line != address.line

      [address.line, address.city, address.country_code].join(', ')
    end

    def total_excl_vat
      total_cost - vat
    end
  end
end
