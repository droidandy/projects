class FleetReportRequest < BaseRequest
  def query
    <<-SQL.freeze
      SELECT
          f.id AS fleet_id,
          date(o.scheduled_at) AS datetime,
          SUM(IF(o.status_id = 7, 1, 0))                                                               AS completed_for_period,
          SUM(IF(o.status_id = 4, 1, 0))                                                               AS canceled_for_period,
          # the logic behind acceptance rate calculations needs to be verified against microstrategy
          ROUND(offers.confirmed_offers * 100 / (offers.confirmed_offers + offers.rejected_offers), 2) AS acceptance_for_period,
          ROUND(average_rating, 2) AS avg_rating_for_period
      FROM taxi_stations f
          LEFT JOIN drivers d ON d.cooperative_taxi_station_id = f.id
          LEFT JOIN orders o ON d.id = o.driver_id
          LEFT JOIN (
                  SELECT
                  f.id AS fleet_id,
                  date(orders.scheduled_at) AS datetime,
                  SUM(IF(of.status_id = 1, 1, 0)) AS pending_offers,
                  SUM(IF(of.status_id = 2, 1, 0)) AS accepted_offers,
                  SUM(IF(of.status_id = 3, 1, 0)) AS rejected_offers,
                  SUM(IF(of.status_id = 4, 1, 0)) AS confirmed_offers,
                  SUM(IF(of.status_id = 5, 1, 0)) AS cancelled_offers,
                  SUM(IF(of.status_id = 6, 1, 0)) AS withdrawn_offers,
                  COUNT(of.id) AS total_offers
              FROM offers of
                  LEFT JOIN drivers dr ON dr.id = of.driver_id
                  LEFT JOIN taxi_stations f ON dr.cooperative_taxi_station_id = f.id
                  LEFT JOIN orders ON orders.id = of.order_id
                      WHERE of.created_at BETWEEN DATE_SUB(NOW(), INTERVAL 30 DAY) AND NOW()
                  GROUP BY f.id, datetime
                  HAVING fleet_id = #{@fleet_id}
                  ) offers ON f.id = offers.fleet_id AND date(o.scheduled_at) = offers.datetime
                  LEFT JOIN (
                  SELECT
                  f.id AS fleet_id,
                  date(o.scheduled_at) AS datetime,
                  AVG(o.rating) AS average_rating
                  FROM orders o
                  LEFT JOIN drivers d ON d.id = o.driver_id
                  LEFT JOIN taxi_stations f ON d.cooperative_taxi_station_id = f.id
                  WHERE o.scheduled_at BETWEEN DATE_SUB(NOW(), INTERVAL 30 DAY) AND NOW()
                  AND o.status_id = 7
                  AND o.rating > 0
                  GROUP BY f.id, datetime
                  HAVING fleet_id = #{@fleet_id}
                  ) rating ON offers.fleet_id = rating.fleet_id AND offers.datetime = rating.datetime
                  WHERE o.scheduled_at BETWEEN DATE_SUB(NOW(), INTERVAL 30 DAY) AND NOW()
                  AND f.id = #{@fleet_id}
                  GROUP BY f.id, datetime
    SQL
  end

  def columns
    %i(
      fleet_id
      date
      completed_for_period
      canceled_for_period
      acceptance_for_period
      avg_rating_for_period
    )
  end

  def ttl
    1.hour
  end

  def model
    FleetReport
  end

  def request_key
    5
  end
end
