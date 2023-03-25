class AllOrdersController < ApplicationController
  def index
    orders_request.date_from = Date.parse(params[:from])
    orders_request.date_to = Date.parse(params[:to])
    render json: orders_request.execute
  end

  private def orders_request
    @orders_request ||= AllOrdersRequest.new(current_company.fleet_id)
  end
end
