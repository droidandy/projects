module Pcaw
  class FetchGeocode < Base
    attributes :location

    normalize_response do
      map from('/Items[0]/Latitude'), to('/lat')
      map from('/Items[0]/Longitude'), to('/lng')
      map from('/Items[0]/Location'), to('/location')

      after_normalize do |_input, output|
        output.merge!(timezone: Timezones.timezone_at(output.slice(:lat, :lng)))
      end
    end

    private def url
      super('/Geocoding/UK/Geocode/v2.10/json3ex.ws')
    end

    private def params
      super.merge(Location: location)
    end
  end
end
