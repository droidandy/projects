module Flightstats
  class Track < Base
    CACHE_OPTIONS = {expires_in: 1.day, race_condition_ttl: 10.seconds}.freeze

    def execute!
      Rails.cache.fetch("flights/track/#{flight_id}", CACHE_OPTIONS) do
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

      if valid_flight?
        response_body = Rails.root.join('spec/fixtures/flightstats/flight_track.json').read
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

      position = response.data['flightTrack']['positions'].first
      {
        lon: position['lon'],
        lat: position['lat'],
        date: position['date']
      }
    end

    private def valid_flight?
      response.data.dig('flightTrack', 'positions').present?
    end

    private def url
      "#{BASE_URL}/flightstatus/rest/v2/json/flight/track/#{flight_id}?maxPositions=1"
    end
  end
end
