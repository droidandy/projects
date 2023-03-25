module Bookings
  class FlightValidator < ApplicationService
    attributes :booking

    delegate :flight, :pickup_address, :destination_address, to: :booking

    private def execute!
      if flight.present? && !valid_flight_number?
        errors[:flight] << I18n.t('validation_errors.flight.not_found')
      end

      if flight.present? &&
        valid_flight_number? &&
        verifiable_provider? &&
        airport_ride? &&
        !flight_number_applies_airports?

        errors[:flight] << I18n.t('validation_errors.flight.not_match')
      end

      if flight.blank? && verifiable_provider? && airport_ride?
        errors[:flight] << I18n.t('validation_errors.flight.required')
      end

      errors.blank?
    end

    def errors
      @errors ||= Hash.new{ |hash, key| hash[key] = [] }
    end

    private def valid_flight_number?
      flights.present?
    end

    private def flights
      flights_service.execute.result
    end

    private def flights_service
      @flights_service ||= Flightstats::Flights.new(
        flight: flight,
        year: flight_date.year,
        month: flight_date.month,
        day: flight_date.day
      )
    end

    private def flight_date
      @flight_date ||= booking.scheduled_at.in_time_zone(booking.timezone).to_date
    end

    private def verifiable_provider?
      booking.carey? || booking.splyt?
    end

    private def airport_ride?
      pickup_address.airport_id.present? || destination_address&.airport_id.present?
    end

    private def flight_number_applies_airports?
      flight_arrival_codes.include?(pickup_address.airport&.iata) ||
        flight_departure_codes.include?(destination_address&.airport&.iata)
    end

    private def flight_arrival_codes
      flights.map { |flight| flight.dig(:arrival, :code) }.compact
    end

    private def flight_departure_codes
      flights.map { |flight| flight.dig(:departure, :code) }.compact
    end
  end
end
