module Bookings
  # Fetches flight-related information for given pickup and/or destination
  # iatas (airport codes). Multiple pickup values can be accepted in array
  # (for primitive support of stop points). Used in both
  # `Bookings::FormProcessors::General` and `Carey::Create`.
  class FlightInfo < ApplicationService
    attributes :flight, :scheduled_at, :pickup_iata, :destination_iata

    def execute!
      arrivals.merge(departure)
    end

    # pickup iata, as well as iatas of all stop points, are used to look for
    # a flight information with a plane *arriving* at this location
    private def arrivals
      Array(pickup_iata).each_with_object({}) do |iata, result|
        result[iata] = data_for(iata, :arrival)
      end
    end

    # the only destination_iata is used to find a flight information with a plane
    # that *departures* from this location
    private def departure
      return {} if destination_iata.blank?

      {destination_iata => data_for(destination_iata, :departure)}
    end

    private def data_for(iata, type)
      data = flights_data.find{ |flight| flight.dig(type, :code) == iata }

      return if data.blank?

      data.slice(:carrier, :flight).merge(data[type])
    end

    private def flights_data
      @flights_data = Flightstats::Flights.new(
        flight: flight,
        year:   scheduled_at.year,
        month:  scheduled_at.month,
        day:    scheduled_at.day
      ).execute.result
    end
  end
end
