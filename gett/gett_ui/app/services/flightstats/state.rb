module Flightstats
  class State < Base
    CACHE_OPTIONS = {expires_in: 1.day, race_condition_ttl: 10.seconds}.freeze

    def execute!
      Rails.cache.fetch("flights/#{carrier}/#{flight_number}/#{year}/#{month}/#{day}", CACHE_OPTIONS) do
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
        response_body = Rails.root.join('spec/fixtures/flightstats/state_flight.json').read
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
        .data['flightStatuses']
        .map do |flight|
          departure_code, arrival_code = flight.fetch_values('departureAirportFsCode', 'arrivalAirportFsCode')
          guide_info = flight.fetch('airportResources', {})
          times = flight.fetch('operationalTimes')

          {
            carrier: flight['carrierFsCode'],
            flight:  flight['flightNumber'],
            flight_id: flight['flightId'],
            airline: airlines[flight['carrierFsCode']],
            departure: {
              code:           departure_code,
              name:           airports[departure_code][:name],
              scheduled_time: times.dig('scheduledGateDeparture', 'dateLocal'),
              estimated_time: times.dig('estimatedGateDeparture', 'dateLocal'),
              actual_time:    times.dig('actualGateDeparture', 'dateLocal'),
              terminal:       guide_info['departureTerminal'],
              gate:           guide_info['departureGate'],
              lat:            airports[departure_code][:lat],
              lng:            airports[departure_code][:lng],
              line:           airports[departure_code][:name],
              postal_code:    airports[departure_code][:postal_code],
              country_code:   airports[departure_code][:country_code],
              timezone:       airports[departure_code][:timezone],
              city:           airports[departure_code][:city],
              airport:        airports[departure_code][:iata]
            },
            arrival: {
              code:         arrival_code,
              name:         airports[arrival_code][:name],
              scheduled_time: times.dig('scheduledGateArrival', 'dateLocal'),
              estimated_time: times.dig('estimatedGateArrival', 'dateLocal'),
              actual_time:    times.dig('actualGateArrival', 'dateLocal'),
              terminal:       guide_info['arrivalTerminal'],
              gate:           guide_info['arrivalGate'],
              baggage:        guide_info['baggage'],
              lat:            airports[arrival_code][:lat],
              lng:            airports[arrival_code][:lng],
              line:           airports[arrival_code][:name],
              postal_code:    airports[arrival_code][:postal_code],
              country_code:   airports[arrival_code][:country_code],
              timezone:       airports[arrival_code][:timezone],
              city:           airports[arrival_code][:city],
              airport:        airports[arrival_code][:iata]
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
      response.data['flightStatuses'].present?
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
      "#{BASE_URL}/flightstatus/rest/v2/json/flight/status/#{carrier}/#{flight_number}" +
        "/dep/#{year}/#{month}/#{day}"
    end
  end
end
