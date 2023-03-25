module Gett
  class Create < Base
    GB_COUNTRY_CODES = %w'GB UK'.freeze

    attributes :booking
    http_method :post

    def normalized_response
      { service_id: response.data['ride_id'] }
    end

    private def url
      super("/business/rides?business_id=#{business_id}")
    end

    private def params
      params = {
        pickup: address_to_params(booking.pickup_address),
        rider: {
          name: booking.passenger_info[:full_name],
          phone_number: localized_phone(booking.passenger_info[:phone_number])
        },
        note_to_driver: booking.message_to_driver,
        product_id: booking.vehicle.value,
        reference: booking.id.to_s
      }

      params[:destination] = address_to_params(booking.destination_address) if booking.destination_address.present?
      params[:scheduled_at] = booking.scheduled_at unless booking.asap?
      params[:payment_type] = payment_type

      if booking.stop_addresses.any?
        stop_points =
          booking.stop_addresses.map do |address|
            address_to_params(address).merge!(
              name: address[:stop_info]['name'],
              phone_number: address[:stop_info]['phone']
            )
          end
        params.merge!(stop_points: stop_points)
      end
      params
    end

    private def payment_type
      # NOTE: at the moment of writing, the only payment_method available for affiliate bookings is 'cash'
      return 'cash' if company.affiliate?

      # NOTE: gett api only accepts 'cash' or 'account'
      # NOTE: 'account' should be sent as 'voucher' per @akorenev request 2017-12-19
      (booking.payment_method == 'cash') ? 'cash' : 'voucher'
    end

    private def address_to_params(address)
      {
        latitude: address.lat,
        longitude: address.lng,
        address: address.line
      }
    end

    private def localized_phone(phone_number)
      unless business_id_country_code.in?(GB_COUNTRY_CODES)
        return phone_number&.gsub(/[^\d]/, '')&.sub(/^0/, ISO3166::Country[:GB].country_code)
      end

      phone_number
    end
  end
end
