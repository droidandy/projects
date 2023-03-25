require 'ostruct'

module Flightstats
  class Schedule < Base
    def execute
      return unless valid?
      return dev_execute! if dev_execute?

      get(url, headers)
      result { processed_response }
    end

    private def processed_response
      return false unless response.success? && valid_flight?

      flight = response.data['scheduledFlights'].first
      departure_code, arrival_code = flight.fetch_values('departureAirportFsCode', 'arrivalAirportFsCode')

      { carrier: flight['carrierFsCode'],
        flight:  flight['flightNumber'],
        departure: {
          code:     departure_code,
          name:     airports[departure_code][:name],
          time:     flight['departureTime'],
          terminal: flight['departureTerminal'],
          lat:      airports[departure_code][:lat],
          lng:      airports[departure_code][:lng]
        },
        arrival: {
          code:     arrival_code,
          name:     airports[arrival_code][:name],
          time:     flight['arrivalTime'],
          terminal: flight['arrivalTerminal'],
          lat:      airports[arrival_code][:lat],
          lng:      airports[arrival_code][:lng]
        }
      }
    end

    private def valid?
      carrier.present? && flight_number.present? && flight_number =~ /^\d+$/
    end

    private def dev_flight?
      sanitized_flight =~ /EK05|EK5/
    end

    private def success_dev_flight?
      sanitized_flight =~ /EK5/
    end

    private def dev_execute?
      super && dev_flight?
    end

    private def dev_execute!
      if success_dev_flight?
        response_body = Rails.root.join('spec/fixtures/flightstats/schedule_response.json').read
        @response = self.class::Response.new(
          OpenStruct.new(body: response_body, code: 200)
        )
        result { processed_response }
      else
        result { false }
      end
    end

    private def valid_flight?
      response.data['scheduledFlights'].one?
    end

    private def airports
      @airports ||= response.data['appendix']['airports'].each_with_object({}) do |airport, result|
        result[airport['fs']] = {
          name: airport['name'],
          lat:  airport['latitude'],
          lng:  airport['longitude']
        }
      end
    end

    private def url
      "#{BASE_URL}/schedules/rest/v1/json/flight/#{carrier}/#{flight_number}" +
        "/departing/#{params[:year]}/#{params[:month]}/#{params[:day]}"
    end
  end
end
