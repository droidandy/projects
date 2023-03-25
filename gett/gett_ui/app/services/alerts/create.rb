module Alerts
  class Create < ApplicationService
    attributes :booking, :type

    TYPE_LEVEL_MAPPINGS = {
      'flight_delayed' => 'medium',
      'flight_cancelled' => 'critical',
      'flight_diverted' => 'critical',
      'flight_redirected' => 'critical',
      'driver_is_late' => 'critical',
      'order_changed' => 'medium',
      'has_no_driver' => 'critical',
      'api_failure' => 'critical'
    }.freeze
    private_constant :TYPE_LEVEL_MAPPINGS

    def execute!
      level = TYPE_LEVEL_MAPPINGS[type.to_s]

      return if level.blank? || booking.alert_for(type).present?

      Alert.create(type: type.to_s, level: level, booking: booking)
    end
  end
end
