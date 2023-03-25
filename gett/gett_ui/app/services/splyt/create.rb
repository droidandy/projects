module Splyt
  class Create < Base
    http_method :post

    attributes :booking

    delegate :passenger_info, to: :booking

    normalize_response do
      map from('/booking/booking_id'), to('/service_id')
    end

    private def url
      super('/v2/bookings')
    end

    private def params
      {
        provider_id:       booking.quote_id,
        region_id:         booking.region_id,
        estimate_id:       booking.estimate_id,
        remote_booking_id: booking.order_id,
        currency_code:     Bookings::DEFAULT_CURRENCY,
        type:              booking_type,
        pickup:            address_data(booking.pickup_address),
        dropoff:           address_data(booking.destination_address),
        passenger: {
          user_id:      user_id,
          first_name:   full_name,
          phone_number: passenger_info[:phone_number].gsub(/[^\d+]/, '')
        },
        configuration: {
          car_type: booking.vehicle.value
        }
      }.tap do |params|
        params[:configuration][:departure_date] = departure_date if booking.future?

        if booking.supports_flight_number? && booking.flight.present?
          params[:configuration][:flight_number] = booking.flight
        end

        if booking.supports_driver_message? && booking.message_to_driver.present?
          params[:configuration][:driver_message] = booking.message_to_driver
        end
      end
    end

    private def booking_type
      booking.asap? ? BookingTypes::ASAP : BookingTypes::FUTURE
    end

    private def user_id
      booking.passenger_id.to_s.presence || SecureRandom.uuid
    end

    private def full_name
      if booking.future?
        passenger_info[:full_name]
      else
        passenger_info[:first_name]
      end
    end

    private def departure_date
      booking.scheduled_at.in_time_zone(booking.timezone).to_datetime.iso8601
    end

    private def request_headers
      { 'Content-Type' => 'application/json' }
    end

    private def address_data(address)
      {
        latitude:  address.lat,
        longitude: address.lng,
        address: {
          # there is no city for some locations, but Splyt side can't handle this properly,
          # so string with single comma symbol is a workaround for this case
          city: address.city || ',',
          country: ISO3166::Country[address.country_code].data['translated_names']&.first
        }
      }.tap do |data|
        data[:address][:name] = address.point_of_interest if address.point_of_interest.present?
        data[:address][:street_name] = address.street_name if address.street_name.present?
        data[:address][:street_number] = address.street_number if address.street_number.present?
        data[:address][:postal_code] = address.postal_code if address.postal_code.present?
        # Fill in a field name with a line from address info if we haven't info about point_of_interest or street_name
        # This helps to avoid the exception from Splyt side
        data[:address][:name] ||= address.line if address.point_of_interest.blank? && address.street_name.blank?
      end
    end
  end
end
