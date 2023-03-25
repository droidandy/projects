class CompletedOrdersQuery
  def initialize(fleet_id:, order_id: nil, date_from: nil, date_to: nil)
    @fleet_id = fleet_id
    @order_id = order_id
    @date_from = date_from
    @date_to = date_to
  end

  def query
    <<-SQL
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
        f.id                                                         AS fleet_id,
        oer.path_points                                              AS path_points
      FROM orders o
        LEFT JOIN drivers d ON o.driver_id = d.id
        LEFT JOIN driver_infos di ON d.id = di.driver_id
        LEFT JOIN locations l_pickup ON o.origin_loc_id = l_pickup.id
        LEFT JOIN locations l_destination ON o.destination_loc_id = l_destination.id
        LEFT JOIN taxi_stations f ON d.cooperative_taxi_station_id = f.id
        LEFT JOIN order_email_receipt oer ON oer.order_id = o.id
        LEFT JOIN order_statuses AS ost ON ost.id = o.status_id
      #{interval_condition}
      #{order_id_condition}
            AND o.status_id IN (4, 7, 9)
            AND f.id = #{@fleet_id}
      GROUP BY o.id
    SQL
  end

  private def interval_condition
    return '' if @order_id
    "WHERE o.scheduled_at BETWEEN #{interval_start} AND #{interval_end}"
  end

  private def interval_start
    @date_from ? "'#{@date_from.to_time.beginning_of_day.to_s(:db)}'" : 'DATE_SUB(NOW(), INTERVAL 7 DAY)'
  end

  private def interval_end
    @date_to ? "'#{@date_to.to_time.end_of_day.to_s(:db)}'" : 'NOW()'
  end

  def order_id_condition
    return '' unless @order_id
    "WHERE o.id = #{@order_id}"
  end
end
