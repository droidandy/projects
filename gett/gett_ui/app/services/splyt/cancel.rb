module Splyt
  class Cancel < Base
    http_method :patch

    attributes :booking

    private def url
      super("/v2/bookings/#{booking.service_id}")
    end

    private def params
      { status: 'canceled' }
    end

    private def request_headers
      { 'Content-Type' => 'application/json' }
    end
  end
end
