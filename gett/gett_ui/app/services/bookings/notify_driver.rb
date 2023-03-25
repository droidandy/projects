module Bookings
  class NotifyDriver < ApplicationService
    attributes :booking, :arrive_in

    def execute!
      return if driver_phone.blank?

      SmsSender.perform_async(driver_phone, sms_text)

      success!
    end

    private def driver_phone
      booking.driver&.phone_number
    end

    private def sms_text
      "Passenger #{booking.passenger.first_name} for order One Transport Order #{booking.order_id}" \
        " will be with you in #{arrive_in} minutes. Thank you!"
    end
  end
end
