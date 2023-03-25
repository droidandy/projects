class FlightstatsController < ApplicationController
  include Shared::FlightstatsController

  def schedule
    service = ::Flightstats::Schedule.new(flight_params)

    if service.execute.success?
      render json: service.result
    else
      head :not_found
    end
  end

  private def flight_params
    params.permit(:flight, :year, :month, :day)
  end
end
