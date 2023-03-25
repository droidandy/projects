module Alerts
  class Remove < ApplicationService
    attributes :booking, :type

    def execute!
      if booking.associations.key?(:alerts)
        booking.alert_for(type)&.destroy
      else
        Alert.where(booking_id: booking.id, type: type).delete
      end
    end
  end
end
