class OrdersReportRequest < BaseRequest
  attr_accessor :fleet_id, :from_date, :to_date

  def query
    <<-SQL.freeze
      SELECT
      orders.id AS 'Order - ID',
      IF(orders.status_id = 7, 'COMPLETED', 'CANCELLED') AS 'Booking - Status',
      DATE(CONVERT_TZ(orders.scheduled_at, 'UTC', 'Europe/London')) AS 'Booking - Date',
      TIME(CONVERT_TZ(orders.scheduled_at, 'UTC', 'Europe/London')) AS 'Booking - Time',
      orders.taxi_station_id AS 'Client - Reference',
      order_divisions.title AS 'VehicleType - Name',
      1 AS 'Booking - Pax',
      1 AS 'Booking - Bax',
      'FALSE' AS 'Booking - AsDirected',
      orders.riding_user_full_name AS 'Passenger - Name',
      '' AS 'Passenger - Mobile',
      '' AS 'Passenger - Email',
      drivers.id AS 'Driver - Callsign',
      drivers.license_no AS 'Vehicle - Registration',
      '' AS 'Booking - Passenger Notes',
      '' AS 'Booking - Driver Notes',
      '' AS 'Booking - Office Notes',
      ROUND(COALESCE(charging_calculations.extras_cost, 0) / 100, 2) AS 'Booking - Extras',
      ROUND(IF(orders.status_id = 7,
      (COALESCE(charging_calculations.base_price, 0) / 100)
      + (COALESCE(charging_calculations.waiting_time_cost, 0) / 100)
      + (COALESCE(charging_calculations.stop_points_cost, 0) / 100)
      + (COALESCE(charging_calculations.extras_cost, 0) / 100)
      + COALESCE(charging_calculations.additional_fee, 0),
      (COALESCE(charging_calculations.waiting_time_cost, 0) / 100)
      + (COALESCE(charging_calculations.cancellation_cost, 0) / 100)
      ), 2) AS 'Booking - Actual Cost',
      ROUND(IF(orders.status_id = 7,
      (COALESCE(charging_calculations.base_price, 0) / 100)
      + (COALESCE(charging_calculations.waiting_time_cost, 0) / 100)
      + (COALESCE(charging_calculations.stop_points_cost, 0) / 100)
      + (COALESCE(charging_calculations.extras_cost, 0) / 100)
      + COALESCE(charging_calculations.additional_fee, 0),
      (COALESCE(charging_calculations.waiting_time_cost, 0) / 100)
      + (COALESCE(charging_calculations.cancellation_cost, 0) / 100)
      ), 2) AS 'Booking - Driver Cost',
      ROUND(IF(orders.status_id = 7,
      (COALESCE(charging_calculations.base_price, 0) / 100)
      + (COALESCE(charging_calculations.waiting_time_cost, 0) / 100)
      + (COALESCE(charging_calculations.stop_points_cost, 0) / 100)
      + (COALESCE(charging_calculations.extras_cost, 0) / 100)
      + COALESCE(charging_calculations.additional_fee, 0),
      (COALESCE(charging_calculations.waiting_time_cost, 0) / 100)
      + (COALESCE(charging_calculations.cancellation_cost, 0) / 100)
      ), 2) AS 'Booking - Invoice Cost',
      ROUND(IF(
      SUBSTRING_INDEX(SUBSTR(charging_commitments.customer, LOCATE('"distance_km"', charging_commitments.customer) + 14, 5), ',', 1) = 'ommit',
      -1,
      SUBSTRING_INDEX(SUBSTR(charging_commitments.customer, LOCATE('"distance_km"', charging_commitments.customer) + 14, 5), ',', 1) * 0.62
      ), 2) AS 'Booking - Distance',
      ROUND(charging_calculation_views.stops_deviation_km * 0.62, 2) AS "Extra Stops Milleage",
      'FALSE' AS 'Booking - Wait And Return',
      '' AS 'Booking - Passenger Notification Phone',
      '' AS 'Booker - Name',
      '' AS 'Booking - Reference',
      pickup_location.title AS 'Stop 1 Address',
      pickup_location.zip AS 'Stop 1 Postcode',
      pickup_location.latitude AS 'Stop 1 Latitude',
      pickup_location.longitude AS 'Stop 1 Longitude',
      destination_location.title AS 'Stop 2 Address',
      destination_location.zip AS 'Stop 2 Postcode',
      destination_location.latitude AS 'Stop 2 Latitude',
      destination_location.longitude AS 'Stop 2 Longitude',
      '' AS 'Stop 3 Address',
      '' AS 'Stop 3 Postcode',
      '' AS 'Stop 3 Latitude',
      '' AS 'Stop 3 Longitude',
      '' AS 'Stop 4 Address',
      '' AS 'Stop 4 Postcode',
      '' AS 'Stop 4 Latitude',
      '' AS 'Stop 4 Longitude',
      '' AS 'OT Reference',
      charging_calculations.paid_waiting_time AS 'Waiting Time'
      FROM orders
        LEFT JOIN divisions order_divisions ON orders.division_id = order_divisions.id
        LEFT JOIN drivers ON orders.driver_id = drivers.id
        LEFT JOIN locations pickup_location ON orders.origin_loc_id = pickup_location.id
        LEFT JOIN locations destination_location ON orders.destination_loc_id = destination_location.id
        LEFT JOIN charging_commitments ON orders.id = charging_commitments.order_id
        LEFT JOIN charging_calculation_views on charging_calculation_views.order_id = orders.id
        LEFT JOIN charging_calculations
          ON orders.id = charging_calculations.order_id AND charging_calculations.calculation_type = 'supplier'
      WHERE
      #{interval_condition}
      AND orders.status_id IN (4, 7)
      AND drivers.cooperative_taxi_station_id = #{fleet_id}
      ORDER BY orders.scheduled_at;
    SQL
  end

  private def interval_condition
    <<-SQL.freeze
      orders.scheduled_at
        BETWEEN CONVERT_TZ('#{interval_start}', 'Europe/London', 'UTC')
        AND CONVERT_TZ('#{interval_end}', 'Europe/London', 'UTC')
    SQL
  end

  private def interval_start
    from_date.to_time.beginning_of_day.to_s(:db)
  end

  private def interval_end
    to_date.to_time.end_of_day.to_s(:db)
  end

  def columns
    [
      :"Order - ID",
      :"Booking - Status",
      :"Booking - Date",
      :"Booking - Time",
      :"Client - Reference",
      :"VehicleType - Name",
      :"Booking - Pax",
      :"Booking - Bax",
      :"Booking - AsDirected",
      :"Passenger - Name",
      :"Passenger - Mobile",
      :"Passenger - Email",
      :"Driver - Callsign",
      :"Vehicle - Registration",
      :"Booking - Passenger Notes",
      :"Booking - Driver Notes",
      :"Booking - Office Notes",
      :"Booking - Extras",
      :"Booking - Actual Cost",
      :"Booking - Driver Cost",
      :"Booking - Invoice Cost",
      :"Booking - Distance",
      :"Extra Stops Milleage",
      :"Booking - Wait And Return",
      :"Booking - Passenger Notification Phone",
      :"Booker - Name",
      :"Booking - Reference",
      :"Stop 1 Address",
      :"Stop 1 Postcode",
      :"Stop 1 Latitude",
      :"Stop 1 Longitude",
      :"Stop 2 Address",
      :"Stop 2 Postcode",
      :"Stop 2 Latitude",
      :"Stop 2 Longitude",
      :"Stop 3 Address",
      :"Stop 3 Postcode",
      :"Stop 3 Latitude",
      :"Stop 3 Longitude",
      :"Stop 4 Address",
      :"Stop 4 Postcode",
      :"Stop 4 Latitude",
      :"Stop 4 Longitude",
      :"OT Reference",
      :"Waiting Time"
    ].freeze
  end
end
