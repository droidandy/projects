module Flightstats
  class Schedule < Base
    private def execute!
      ActiveSupport::Dependencies.interlock.permit_concurrent_loads do
        threads = flights_services.map{ |s| Thread.new { s.execute } }
        threads.each(&:join)
      end

      result do
        flights_services.select(&:success?).map do |service|
          {date: service.date, flights: service.result}
        end
      end

      assert { result.any?(&:present?) }
    end

    private def flights_services
      @flights_services ||=
        date_range.map do |date|
          ::Flightstats::Flights.new(
            flight: flight,
            year: date.year,
            month: date.month,
            day: date.day
          )
        end
    end

    private def date_range
      @date_range ||= (date - 1.day)..(date + 5.days)
    end
  end
end
