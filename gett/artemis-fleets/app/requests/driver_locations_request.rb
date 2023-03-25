require 'location_client'

class DriverLocationsRequest < BaseRequest
  def query
    <<-SQL.freeze
      SELECT
        d.id AS driver_id,
        d.name as driver_name,
        d.phone as driver_phone,
        d.license_no as license_number,
        d.car_model as car_model,
        di.status_id,
        f.id as fleet_id
      FROM drivers d
        LEFT JOIN taxi_stations f ON d.cooperative_taxi_station_id = f.id
        LEFT JOIN driver_infos di ON d.id = di.driver_id
      WHERE f.id = #{@fleet_id}
    SQL
  end

  def columns
    %i(
      driver_id
      driver_name
      driver_phone
      license_number
      car_model
      status_id
      fleet_id
    ).freeze
  end

  def ttl
    45.seconds
  end

  def model
    DriverLocation
  end

  def request_key
    3
  end

  def remote_records
    records = super
    locations = LocationClient.new(@fleet_id).locations
    records.map do |record|
      location = locations.fetch(record[:driver_id], {})
      record.merge(location)
    end
  end
end
