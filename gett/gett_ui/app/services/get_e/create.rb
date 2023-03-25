module GetE
  class Create < Base
    attributes :booking
    http_method :post

    def normalized_response
      fare_quote = response.data.dig('data', 'Pricing', 'Price', 'Amount')
      fare_quote = (fare_quote * 100).round if fare_quote.present?
      {
        service_id: response.data.dig('data', 'Unid'),
        fare_quote: fare_quote
      }
    end

    private def url
      super('/transfers')
    end

    private def params
      passenger = booking.passenger_info
      {
        Passengers: {
          '1': {
            FirstName: passenger[:first_name],
            LastName: passenger[:last_name] || passenger[:first_name], # last name is required
            Email: passenger_email,
            PhoneNumber: passenger[:phone_number],
            Primary: '1'
          }
        },
        Option: {
          Uuid: booking.quote_id
        },
        Occupancy: {
          Passengers: 3,
          Bags: 3
        },
        Info: {
          CustomerRequest: booking.message_to_driver,
          ConnectionDetails: flight_data
        }
      }
    end

    private def flight_data
      return {} if booking.flight.blank?

      {
        Number: booking.flight,
        Type: 'Airline'
      }
    end

    private def passenger_email
      passenger = booking.passenger_info
      return passenger[:email] if passenger[:email].present?

      sanitized_phone = passenger[:phone_number].delete('^0-9')
      "#{sanitized_phone}@gett.com"
    end
  end
end
