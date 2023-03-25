module Gett
  class Modify < Base
    attributes :booking
    http_method :patch

    private def url
      super("/business/rides/#{booking.service_id}?business_id=#{business_id}")
    end

    def normalized_response
      { service_id: booking.service_id }
    end

    private def params
      params = {
        pickup: address_to_params(booking.pickup_address),
        note_to_driver: booking.message_to_driver,
        product_id: booking.vehicle.value,
        reference: booking.id.to_s
      }

      params[:destination] = address_to_params(booking.destination_address) if booking.destination_address.present?
      params[:scheduled_at] = booking.scheduled_at unless booking.asap?

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

    private def address_to_params(address)
      {
        latitude: address.lat,
        longitude: address.lng,
        address: address.line
      }
    end
  end
end
