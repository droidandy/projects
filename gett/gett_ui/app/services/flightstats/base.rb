module Flightstats
  class Base < ApplicationService
    include ::ApplicationService::Context
    include ::ApplicationService::RestMethods

    BASE_URL = 'https://api.flightstats.com/flex'.freeze
    CREDENTIALS = {
      'appId'  => Settings.flightstats.client_id,
      'appKey' => Settings.flightstats.client_secret
    }.freeze
    FLIGHT_REGEX = /^0*(?<carrier>[A-Z0-9]{2}[A-Z]?)0*(?<number>[0-9]{1,})$/
    private_constant :BASE_URL, :CREDENTIALS, :FLIGHT_REGEX

    attributes :flight, :year, :month, :day, :flight_id

    module FlightValidation
      private def execute!
        return if (flight_id.blank? || invalid_flight_id?) && (flight.blank? || flight_data.blank?)
        return dev_execute! if dev_execute? && respond_to?(:dev_execute!)

        super
      end
    end

    def self.inherited(service_class)
      super
      service_class.send(:prepend, FlightValidation)
    end

    def processed_response
      fail "#{self.class} does not implement ##{__method__} method"
    end

    def date
      @date ||= Date.new(year.to_i, month.to_i, day.to_i)
    end

    private def flight_data
      @flight_data ||= sanitized_flight.match(FLIGHT_REGEX)
    end

    private def sanitized_flight
      flight.gsub(/[^a-zA-Z\d]/, '').upcase
    end

    private def invalid_flight_id?
      flight_id.to_s.scan(/\D/).present?
    end

    private def carrier
      flight_data[:carrier]
    end

    private def flight_number
      flight_data[:number]
    end

    private def dev_execute?
      Rails.env.development? || Rails.env.dev?
    end
  end
end
