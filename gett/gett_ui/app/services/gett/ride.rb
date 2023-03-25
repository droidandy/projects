require 'geokit'

module Gett
  class Ride < Base
    include ApplicationService::NormalizedResponse

    http_method :get
    attributes :booking

    normalize_response do
      map from('/status'), to('/status')
      map from('/driver/name'), to('/driver/name')
      map from('/driver/image_url'), to('/driver/image_url')
      map from('/driver/phone_number'), to('/driver/phone_number')
      map from('/driver/phv_license'), to('/driver/phv_license')
      map from('/driver/rating'), to('/driver/rating')
      map from('/driver/vehicle'), to('/driver/vehicle')
      map from('/will_arrive_at'), to('/driver/will_arrive_at')
      map from('/driver/location/latitude'), to('/driver/lat')
      map from('/driver/location/longitude'), to('/driver/lng')
      map from('/driver/location/bearing'), to('/driver/bearing')
      map from('/pickup/latitude'), to('/driver/pickup_lat')
      map from('/pickup/longitude'), to('/driver/pickup_lng')

      before_normalize do |input|
        driver_location = input.dig('driver', 'location') || {}
        if driver_location['latitude'] == 0 && driver_location['longitude'] == 0
          input['driver']['location'] = {}
        end
        input
      end

      after_normalize do |input, output|
        if (will_arrive_at = input['will_arrive_at']).present?
          minutes = ((Time.zone.parse(will_arrive_at) - Time.current) / 60).round
          output[:driver][:eta] = (minutes > 0) ? minutes : 0
        end
        output[:driver][:vendor_name] = 'Gett' if output[:driver]
        output
      end
    end

    private def url
      super("/business/rides/#{booking.service_id}?business_id=#{business_id}")
    end
  end
end
