module Manual
  class Create < Base
    def normalized_response
      {
        service_id: booking.id,
        fare_quote: 0
      }
    end
  end
end
