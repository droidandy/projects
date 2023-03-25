class FutureOrdersRequest < BaseRequest
  def query
    <<-SQL.freeze
      SELECT
        o.id                                                         AS order_id,
        CONVERT_TZ(o.scheduled_at, 'UTC', 'Europe/London')           AS scheduled_at,
        d.id                                                         AS driver_id,
        d.name                                                       AS driver_name,
        d.phone                                                      AS driver_phone,
        d.picture_url                                                AS driver_photo,
        d.car_model                                                  AS driver_car_model,
        d.license_no                                                 AS driver_taxi_reg,
        d.device_type_name                                           AS driver_device_type,
        o.riding_user_full_name                                      AS passenger_name,
        di.status_id                                                 AS driver_status,
        dt.driver_type                                               AS driver_type,
        o.created_at                                                 AS order_received,
        o.scheduled_at                                               AS pickup_time,
        o.will_arrive_at                                             AS will_arrive_at,
        o.arrived_at                                                 AS arrived_at,
        o.waiting_time                                               AS waiting_time_minutes,
        o.started_at                                                 AS passanger_on_board,
        o.ended_at                                                   AS order_ended_at,
        o.cancelled_at                                               AS order_cancelled_at,
        CASE
          WHEN ost.short_name = 'Rejected' THEN o.updated_at
          ELSE NULL
        END                                                          AS order_rejected_at,
        o.rating                                                     AS driver_rating,
        l_pickup.title                                               AS pickup_address,
        CONCAT(l_pickup.latitude, ',', l_pickup.longitude)           AS pickup_location,
        l_destination.title                                          AS destination_address,
        CONCAT(l_destination.latitude, ',', l_destination.longitude) AS destination_location,
        o.status_id                                                  AS order_status,
        lower(ost.short_name)                                        AS order_status_name,
        f.id                                                         AS fleet_id
      FROM orders o
        LEFT JOIN (
                    SELECT
                      o.id                                                       AS order_id,
                      COALESCE(o.driver_id, o.reserved_driver_id, dfo.driver_id) AS driver_id,
                      CASE
                      WHEN o.reserved_driver_id IS NOT NULL AND dfo.driver_id IS NOT NULL
                        THEN 'reserved_by_driver'
                      WHEN o.reserved_driver_id IS NOT NULL AND dfo.driver_id IS NULL
                        THEN 'reserved_by_cc'
                      WHEN o.reserved_driver_id IS NULL AND dfo.driver_id IS NULL AND o.driver_id IS NULL
                        THEN 'not_assigned'
                      WHEN o.reserved_driver_id IS NULL AND dfo.driver_id IS NULL AND o.driver_id IS NOT NULL
                        THEN 'auto_assigned'
                      END                                                        AS driver_type
                    FROM orders o
                      LEFT JOIN driver_future_orders dfo
                        ON o.id = dfo.order_id AND o.reserved_driver_id = dfo.driver_id AND dfo.status = 'accepted'
                    WHERE o.scheduled_at > DATE_SUB(NOW(), INTERVAL 1 DAY)
                  ) dt ON dt.order_id = o.id
        LEFT JOIN drivers d ON dt.driver_id = d.id
        LEFT JOIN driver_infos di ON d.id = di.driver_id
        LEFT JOIN locations l_pickup ON o.origin_loc_id = l_pickup.id
        LEFT JOIN locations l_destination ON o.destination_loc_id = l_destination.id
        LEFT JOIN taxi_stations f ON d.cooperative_taxi_station_id = f.id
        LEFT JOIN order_statuses AS ost ON ost.id = o.status_id
      WHERE o.scheduled_at > DATE_SUB(NOW(), INTERVAL 1 DAY)
            AND TIME_TO_SEC(TIMEDIFF(o.scheduled_at, o.created_at)) > 900
            AND o.status_id IN (1)
            AND f.id = #{@fleet_id}
      GROUP BY o.id
      HAVING driver_type != 'not_assigned'
    SQL
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
      driver_type
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
    ).freeze
  end

  def ttl
    45.seconds
  end

  def model
    FutureOrder
  end

  def request_key
    6
  end
end
