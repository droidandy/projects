module Flightstats
  class Requests::FlightStatus < ::Flightstats::Base
    FLIGHT_STATUS_MAPPINGS = {
      'A' => 'flight_active',
      'C' => 'flight_cancelled',
      'D' => 'flight_diverted',
      'L' => 'flight_landed',
      'R' => 'flight_redirected',
      'S' => 'flight_scheduled'
    }.freeze
    private_constant :FLIGHT_STATUS_MAPPINGS

    attributes :direction

    def execute!
      get(url, CREDENTIALS) do |on|
        on.success { result { processed_response } }
        on.failure { fail! }
      end
    end

    private def dev_execute!
      result { { status: 'flight_scheduled' } }
    end

    def processed_response
      return false unless response.success? && flight_status_data.present?

      { status: status }
    end

    private def status
      return if flight_status_data.blank?

      if delay.present? && delay > 30 # NOTE: if > 30 min it is a serious delay.
        'flight_delayed'
      else
        FLIGHT_STATUS_MAPPINGS[flight_status_data['status']]
      end
    end

    private def flight_status_data
      @flight_status_data ||= response.data['flightStatuses']&.first
    end

    private def delay
      flight_status_data.dig('delays', 'arrivalGateDelayMinutes')
    end

    private def url
      "#{BASE_URL}/flightstatus/rest/v2/json/flight/status/#{carrier}/#{flight_number}" +
        "/#{direction}/#{year}/#{month}/#{day}"
    end
  end
end
