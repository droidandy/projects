class ActiveOrdersController < ApplicationController
  def index
    render json: ActiveOrdersRequest.new(current_company.fleet_id).execute
  end
end
