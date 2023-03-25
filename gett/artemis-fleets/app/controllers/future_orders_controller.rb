class FutureOrdersController < ApplicationController
  def index
    render json: FutureOrdersRequest.new(current_company.fleet_id).execute
  end
end
