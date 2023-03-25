module Flightstats
  class Requests::FlightSchedule < ::Flightstats::Base
    CACHE_OPTIONS = {expires_in: 1.day, race_condition_ttl: 10.seconds}.freeze

    attributes :direction

    def execute!
      Rails.cache.fetch("flights/#{carrier}/#{direction}/#{flight_number}/#{year}/#{month}/#{day}", CACHE_OPTIONS) do
        get(url, CREDENTIALS) do |on|
          on.success do
            result { processed_response }
          end
        end

        result
      end
    end

    private def dev_execute!
      sleep(2)

      if success_dev_flight?
        response_body = Rails.root.join('spec/fixtures/flightstats/schedule_response.json').read
        @response = ApplicationService::RestMethods::Response.new(
          Hashie::Mash.new(body: response_body, code: 200)
        )
        result { processed_response }
      else
        fail!
      end
    end

    private def processed_response
      return unless response.success? && valid_flight?

      response
        .data['scheduledFlights']
        .map do |flight|
          departure_code, arrival_code = flight.fetch_values('departureAirportFsCode', 'arrivalAirportFsCode')

          {
            carrier: flight['carrierFsCode'],
            flight:  flight['flightNumber'],
            airline: airlines[flight['carrierFsCode']],
            departure: {
              code:         departure_code,
              name:         airports[departure_code][:name],
              time:         flight['departureTime'],
              terminal:     flight['departureTerminal'],
              lat:          airports[departure_code][:lat],
              lng:          airports[departure_code][:lng],
              line:         airports[departure_code][:name],
              postal_code:  airports[departure_code][:postal_code],
              country_code: airports[departure_code][:country_code],
              timezone:     airports[departure_code][:timezone],
              city:         airports[departure_code][:city],
              airport:      airports[departure_code][:iata]
            },
            arrival: {
              code:         arrival_code,
              name:         airports[arrival_code][:name],
              time:         flight['arrivalTime'],
              terminal:     flight['arrivalTerminal'],
              lat:          airports[arrival_code][:lat],
              lng:          airports[arrival_code][:lng],
              line:         airports[arrival_code][:name],
              postal_code:  airports[arrival_code][:postal_code],
              country_code: airports[arrival_code][:country_code],
              timezone:     airports[arrival_code][:timezone],
              city:         airports[arrival_code][:city],
              airport:      airports[arrival_code][:iata]
            }
          }
        end
        .sort_by{ |flight| flight[:departure][:time] }
    end

    private def dev_flight?
      url =~ %r{flight/EK/[05]/}
    end

    private def success_dev_flight?
      url =~ %r{flight/EK/5/}
    end

    private def dev_execute?
      super && dev_flight?
    end

    private def valid_flight?
      response.data['scheduledFlights'].present?
    end

    private def airports
      @airports ||=
        response.data['appendix']['airports'].each_with_object({}) do |airport, result|
          result[airport['fs']] = {
            name: airport['name'],
            lat:  airport['latitude'],
            lng:  airport['longitude'],
            postal_code: airport['postalCode'],
            country_code: airport['countryCode'],
            city: airport['city'],
            iata: airport['iata'],
            timezone: airport['timeZoneRegionName']
          }
        end
    end

    private def airlines
      @airlines ||=
        response.data['appendix']['airlines'].each_with_object({}) do |airlines, result|
          result[airlines['fs']] = airlines['name']
        end
    end

    private def url
      "#{BASE_URL}/schedules/rest/v1/json/flight/#{carrier}/#{flight_number}" +
        "/#{direction}/#{year}/#{month}/#{day}"
    end
  end
end
