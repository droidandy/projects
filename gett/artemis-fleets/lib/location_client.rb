class LocationClient
  API_URL = 'https://location.gett.com/api/v1/drivers/cc/locations'\
    '?env=GB&lat=51.509466&lon=-0.088500&status=free,routing,in_order'\
    '&radius=1000000000000000000000000000000&count=1000&short_format=true&taxi_station_id='

  def initialize(fleet_id)
    @fleet_id = fleet_id
  end

  def locations
    response = Excon.get(url)
    return {} unless response.status == 200
    JSON.parse(response.body).fetch('drivers').each_with_object({}) do |driver, acc|
      acc[driver.fetch('driver_id').to_i] = {
        latitude: driver.fetch('location', []).last,
        longitude: driver.fetch('location', []).first
      }
    end
  end

  private def url
    API_URL + @fleet_id.to_s
  end
end
