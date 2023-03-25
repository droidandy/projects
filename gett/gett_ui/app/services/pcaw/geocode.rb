module Pcaw
  class Geocode < ApplicationService
    attributes :location_id

    def execute!
      address = fetch_address
      if address
        geocoded_data = basic_geocode(address)
        geocoded_data.merge(address)
      end
    end

    private def fetch_address
      service = Pcaw::FetchAddress.new(location_id: location_id)

      service.result if service.execute.success?
    end

    private def basic_geocode(addr)
      service = Pcaw::FetchGeocode.new(location: addr[:postal_code])

      service.result if service.execute.success?
    end
  end
end
