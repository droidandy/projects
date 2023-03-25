module Mobile::V1
  class DriversController < ApplicationController
    def channel
      render json: { channel: ::Drivers::FetchChannel.new(params: drivers_params).execute.result }
    end

    def locations
      render json: { drivers: ::Drivers::Locations.new(params: drivers_params).execute.result }
    end

    private def drivers_params
      params.permit(:lat, :lng, :country_code)
    end
  end
end
