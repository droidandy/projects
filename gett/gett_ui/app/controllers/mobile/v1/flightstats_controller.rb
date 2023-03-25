module Mobile::V1
  class FlightstatsController < ApplicationController
    include ::Shared::FlightstatsController

    def schedule_states
      service = ::Flightstats::ScheduleState.new(flight_params)

      if service.execute.success?
        render json: service.result
      else
        head :not_found
      end
    end

    def track
      service = ::Flightstats::Track.new(flight_id: params[:flight_id])
      if service.execute.success?
        render json: service.result
      else
        head :not_found
      end
    end

    private def flight_params
      params.permit(:flight, :flight_type, :year, :month, :day)
    end
  end
end
