module Splyt
  class Receipt < Base
    http_method :get

    attributes :booking

    normalize_response do
      map from('/receipt/amount'), to('amount')
    end

    private def url
      super("/v2/bookings/#{booking.service_id}/receipt")
    end
  end
end
