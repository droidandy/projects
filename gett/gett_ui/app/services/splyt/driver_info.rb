module Splyt
  class DriverInfo < Base
    SPLYT_VENDOR_NAME = 'Splyt'.freeze
    DRIVER_NOT_ASSIGNED_CODE = 30103

    http_method :get

    attributes :booking

    normalize_response do
      map from('/'),                                  to('/driver/vendor_name') { SPLYT_VENDOR_NAME }
      map from('/errno'),                             to('/error_code')
      map from('/driver/first_name'),                 to('/driver/name')
      map from('/driver/profile_picture'),            to('/driver/image_url')
      map from('/driver/phone_number'),               to('/driver/phone_number')
      map from('/driver/vehicle/license_plate'),      to('/driver/vehicle/license_plate')
      map from('/driver/vehicle/location/latitude'),  to('/driver/lat')
      map from('/driver/vehicle/location/longitude'), to('/driver/lng')
      map from('/driver/vehicle/location/bearing'),   to('/driver/bearing')
      map from('/driver/vehicle'),                    to('/driver/vehicle/model') do |response_hash|
        "#{response_hash['make']} #{response_hash['model']}"
      end
    end

    def success?
      super || driver_not_assigned?
    end

    private def url
      super("/v2/bookings/#{booking.service_id}/driver")
    end

    private def log_request_error(*args)
      return if driver_not_assigned?

      super
    end

    private def driver_not_assigned?
      normalized_response[:error_code] == DRIVER_NOT_ASSIGNED_CODE
    end
  end
end
