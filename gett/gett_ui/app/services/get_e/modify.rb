module GetE
  class Modify < Base
    attributes :booking
    http_method :patch

    private def url
      super("/transfers/#{booking.service_id}")
    end

    def normalized_response
      { service_id: response.data['data']['Unid'] }
    end

    private def params
      {
        Occupancy: {
          Passengers: 3,
          Bags: 3
        },
        Option: {
          Uuid: booking.quote_id
        },
        Info: {
          CustomerRequest: booking.message_to_driver,
          ConnectionDetails: flight_data
        }
      }
    end

    private def address_to_params(address)
      {
        latitude: address.lat,
        longitude: address.lng,
        address: address.line
      }
    end

    private def flight_data
      return {} if booking.flight.blank?

      {
        Number: booking.flight,
        Type: 'Airline'
      }
    end
  end
end
