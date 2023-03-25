module Flightstats
  class Status < ApplicationService
    attributes :flight, :year, :month, :day

    def execute!
      arriving_service  = Requests::FlightStatus.new(attributes.merge(direction: 'arr'))
      departing_service = Requests::FlightStatus.new(attributes.merge(direction: 'dep'))

      result do
        if arriving_service.execute.success?
          arriving_service.execute.result
        else
          departing_service.execute.result
        end
      end
    end
  end
end
