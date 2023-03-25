class FlightstatsController < ApplicationController
  def schedule
    service = Flightstats::Schedule.new(params: flight_params)

    if service.execute
      render json: service.result, status: :ok
    else
      head :not_found
    end
  end

  private def flight_params
    params.permit(:flight, :year, :month, :day)
  end
end
