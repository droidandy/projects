module Loqate
  # For the API docs, please visit
  # https://www.loqate.com/resources/support/apis/Geocoding/UK/ReverseGeocode/1.1/
  class ReverseGeocode < ApplicationService
    include ApplicationService::RestMethods
    include ApplicationService::NormalizedResponse

    attributes :lat, :lng, :closest

    delegate :api_key, :reverse_geocode_url, to: 'Settings.loqate'

    normalize_response do
      map from('/Items'), to('/items') do |items|
        normalize_array(items) do
          map from('/Postcode'), to('post_code')
          map from('/Latitude'), to('lat')
          map from('/Longitude'), to('lng')
          map from('/Distance'), to('distance')
        end
      end
    end

    def execute!
      get("#{reverse_geocode_url}?#{params.to_param}")

      closest ? normalized_response[:items].min_by{ |item| item[:distance] } : normalized_response[:items]
    end

    private def params
      {Key: api_key, CentrePoint: "#{lat},#{lng}"}
    end
  end
end
