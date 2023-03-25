module OneTransport
  class VehicleLocation < Base
    DRIVER_NAME_REGEXP = /^(?:(?<phone>[+\-0-9\s\(\)]+)\s+)?(?<name>\D.+)$/
    private_constant :DRIVER_NAME_REGEXP

    attributes :external_reference

    normalize_response do
      prefix = '/vehicle_availabilities/vehicle_availabilty_structure'

      map from("#{prefix}/eta"), to('/driver/eta') do |will_arrive_at|
        next if will_arrive_at.blank?

        # 1 hour is subtracted to compensate daylight saving time.
        minutes = ((Time.zone.parse(will_arrive_at) - 1.hour - Time.current) / 60).round
        (minutes > 0) ? minutes : 0
      end
      map from("#{prefix}/vehicle_state"), to('/vehicle_state')
      map from("#{prefix}/vehicle/driver_name"), to('/driver/name') do |value|
        value.match(DRIVER_NAME_REGEXP)[:name]
      end
      map from("#{prefix}/location/latitude"), to('/driver/lat')
      map from("#{prefix}/location/longitude"), to('/driver/lng')
      map from("#{prefix}/vehicle/description"), to('/driver/vehicle/model')
      map from("#{prefix}/vehicle/colour"), to('/driver/vehicle/color')
      map from("#{prefix}/vehicle/reg_no"), to('/driver/vehicle/license_plate')
      map from("#{prefix}/vehicle/vendor_name"), to('/driver/vendor_name')
      map from("#{prefix}/vehicle/driver_mobile_number"), to('/driver/phone_number')

      before_normalize do |input|
        driver_location = input.dig(:vehicle_availabilities, :vehicle_availabilty_structure, :location) || {}
        if driver_location[:latitude] == '0' && driver_location[:longitude] == '0'
          input[:vehicle_availabilities][:vehicle_availabilty_structure][:location] = {}
        end
        input
      end
    end

    def options
      { o_t_confirmation_number: external_reference }
    end

    private def notify_airbrake_on_soap_failure?
      false
    end
  end
end
