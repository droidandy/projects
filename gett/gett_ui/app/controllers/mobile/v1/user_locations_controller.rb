module Mobile::V1
  class UserLocationsController < ApplicationController
    def create
      service = Mobile::V1::UserLocations::Create.new(user: current_member, point: location_params)

      if service.execute.success?
        head :ok
      else
        head :bad_request
      end
    end

    private def location_params
      params.permit(:lat, :lng)
    end
  end
end
