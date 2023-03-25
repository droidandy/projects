class OrdersCountRequest < BaseRequest
  attr_accessor :fleet_id, :state

  STATES = {
    active: '2, 3, 5, 6, 8',
    future: '1',
    completed: '4, 7, 9',
    all: '1, 2, 3, 4, 5, 6, 7, 8, 9'
  }

  def query
    <<-SQL.freeze
      SELECT
        COUNT(*) AS orders_count
      FROM orders o
        LEFT JOIN drivers d ON o.driver_id = d.id
        LEFT JOIN taxi_stations f ON d.cooperative_taxi_station_id = f.id
      WHERE o.status_id IN (#{state_ids})
            AND f.id = #{fleet_id}
    SQL
  end

  def columns
    %i(orders_count).freeze
  end

  def state_ids
    STATES[@state] or raise 'UnknownState'
  end
end
