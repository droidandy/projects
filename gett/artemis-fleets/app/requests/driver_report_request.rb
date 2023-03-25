class DriverReportRequest < BaseRequest
  def query
    <<-SQL.freeze
      SELECT
        d.id                                                                                         AS driver_id,
        d.name                                                                                       AS driver_name,
        d.phone                                                                                      AS driver_phone,
        f.id                                                                                         AS fleet_id,
        SUM(IF(o.status_id = 7, 1, 0))                                                               AS completed_for_period,
        # the logic behind acceptance rate calculations needs to be verified against microstrategy
        ROUND(offers.confirmed_offers * 100 / (offers.confirmed_offers + offers.rejected_offers), 2) AS acceptance_for_period,
        ROUND(average_rating, 2)                                                                     AS avg_rating_for_period
      FROM drivers d
        LEFT JOIN orders o ON d.id = o.driver_id
        LEFT JOIN taxi_stations f ON d.cooperative_taxi_station_id = f.id
        LEFT JOIN (
                    SELECT
                      o.driver_id,
                      SUM(IF(o.status_id = 1, 1, 0)) AS pending_offers,
                      SUM(IF(o.status_id = 2, 1, 0)) AS accepted_offers,
                      SUM(IF(o.status_id = 3, 1, 0)) AS rejected_offers,
                      SUM(IF(o.status_id = 4, 1, 0)) AS confirmed_offers,
                      SUM(IF(o.status_id = 5, 1, 0)) AS cancelled_offers,
                      SUM(IF(o.status_id = 6, 1, 0)) AS withdrawn_offers,
                      COUNT(o.id)                    AS total_offers
                    FROM offers o
                    WHERE o.created_at BETWEEN #{period}
                    GROUP BY o.driver_id
                  ) offers ON d.id = offers.driver_id
        LEFT JOIN (
                    SELECT
                      o.driver_id,
                      AVG(o.rating) AS average_rating
                    FROM orders o
                    WHERE o.scheduled_at BETWEEN #{period}
                          AND o.status_id = 7
                          AND o.rating > 0
                    GROUP BY o.driver_id
                  ) rating ON d.id = rating.driver_id
      WHERE o.scheduled_at BETWEEN #{period}
            AND f.id = #{@fleet_id}
      GROUP BY d.id
    SQL
  end

  def columns
    %i(
      driver_id
      driver_name
      driver_phone
      fleet_id
      completed_for_period
      acceptance_for_period
      avg_rating_for_period
    ).freeze
  end

  def ttl
    1.hour
  end

  def model
    DriverReport
  end

  def request_key
    4
  end
end
