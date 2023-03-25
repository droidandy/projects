class CompletedOrdersController < ApplicationController
  def index
    if params[:from] && params[:to]
      orders_request.date_from = Date.parse(params[:from])
      orders_request.date_to = Date.parse(params[:to])
      return render json: orders_request.execute
    end

    render json: orders_request.execute
  end

  def show
    order = orders_request.execute.find_by(order_id: params[:id])

    if order
      render json: order.as_json(only: %i(order_id path_points))
    else
      orders_request.order_id = params[:id].to_i
      order = orders_request.remote_records.first

      if order
        render json: order.slice(:order_id, :path_points)
      else
        head :not_found
      end
    end
  end

  private def orders_request
    @orders_request ||= CompletedOrdersRequest.new(current_company.fleet_id)
  end
end
