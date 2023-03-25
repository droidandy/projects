module GetE
  class Cancel < Base
    http_method :delete

    attributes :booking

    def url
      super("/transfers/#{booking.service_id}")
    end

    def error_message
      response.data['ErrorMessage']
    end

    def cancellation_quote
      fare_quote = GetE::Transfer.new(transfer_id: booking.service_id).execute.normalized_response[:fare_quote]
      fare_quote || Bookings::DEFAULT_CANCELLATION_QUOTE
    end
  end
end
