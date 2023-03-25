class DriverReportsController < ApplicationController
  def index
    request_class = if params[:week] == 'previous'
                PreviousWeekDriverReportRequest
              else
                CurrentWeekDriverReportRequest
              end
    render json: request_class.new(current_company.fleet_id).execute
  end
end
