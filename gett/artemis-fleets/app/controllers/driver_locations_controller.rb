class DriverLocationsController < ApplicationController
  def index
    render json: DriverLocationsRequest.new(current_company.fleet_id).execute
  end
end
