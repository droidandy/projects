class FleetReportsController < ApplicationController
  def index
    render json: FleetReportRequest.new(current_company.fleet_id, skip_update: true).execute
  end
end
