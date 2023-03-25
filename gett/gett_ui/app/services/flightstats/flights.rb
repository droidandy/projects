module Flightstats
  class Flights < ApplicationService
    attributes :flight, :year, :month, :day

    def execute!
      departing_service = ::Flightstats::Requests::FlightSchedule.new(attributes.merge(direction: 'departing'))
      arriving_service  = ::Flightstats::Requests::FlightSchedule.new(attributes.merge(direction: 'arriving'))

      result do
        if departing_service.execute.success?
          departing_service.execute.result
        else
          arriving_service.execute.result
        end
      end
    end

    def date
      @date ||= Date.new(year.to_i, month.to_i, day.to_i)
    end
  end
end
