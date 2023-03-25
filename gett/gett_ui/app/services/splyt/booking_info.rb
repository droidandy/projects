module Splyt
  class BookingInfo < Base
    http_method :get

    attributes :booking

    normalize_response do
      map from('/provider/remote_booking_id'), to('/supplier_service_id')
      map from('/provider/info/passenger_message'), to('/message_from_supplier')
      map from('/provider/info/otp_code'), to('/otp_code')
    end

    private def url
      super("/v2/bookings/#{booking.service_id}")
    end
  end
end
