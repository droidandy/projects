class CompletedOrdersRequest < BaseRequest
  attr_accessor :order_id, :date_from, :date_to

  def query
    CompletedOrdersQuery.new(
      fleet_id: @fleet_id,
      order_id: @order_id,
      date_from: @date_from,
      date_to: @date_to
    ).query
  end

  def columns
    %i(
      order_id
      scheduled_at
      driver_id
      driver_name
      driver_phone
      driver_photo
      driver_car_model
      driver_taxi_reg
      driver_device_type
      passenger_name
      driver_status
      order_received
      pickup_time
      will_arrive_at
      arrived_at
      waiting_time_minutes
      passanger_on_board
      order_ended_at
      order_cancelled_at
      order_rejected_at
      driver_rating
      pickup_address
      pickup_location
      destination_address
      destination_location
      order_status
      order_status_name
      fleet_id
      path_points
    ).freeze
  end

  def ttl
    45.seconds
  end

  def model
    CompletedOrder
  end

  def request_key
    2
  end
end
