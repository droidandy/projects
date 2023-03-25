module Gett
  class Cancel < Base
    http_method :post

    attributes :booking

    def url
      super("/business/rides/#{booking.service_id}/cancel?business_id=#{business_id}")
    end

    def error_message
      response.data['error_description']
    end

    def cancellation_quote
      Bookings::DEFAULT_CANCELLATION_QUOTE
    end
  end
end
