module Shared::FlightstatsController
  def flights
    service = ::Flightstats::Flights.new(flight_params)

    if service.execute.success?
      render json: service.result
    else
      head :not_found
    end
  end
end
