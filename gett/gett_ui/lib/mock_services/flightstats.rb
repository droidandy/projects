module MockServices
  class Flightstats < Base
    def self.match_urls
      [
        'flightstats.com'
      ]
    end

    def service_name
      'flight_stats'
    end

    def erb_parameters
      { void: nil }
    end

    def request_type
      case URI(request.uri).path
      when %r(schedules/rest/v1/json/flight)
        'flights'
      when %r(flightstatus/rest/v2/json/flight/status)
        'status'
      end
    end
  end
end
