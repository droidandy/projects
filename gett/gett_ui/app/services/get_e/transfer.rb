module GetE
  class Transfer < Base
    include ApplicationService::NormalizedResponse

    http_method :get
    attributes :transfer_id

    def normalized_response
      fare_quote = response.data.dig('data', 'Pricing', 'Price', 'Amount')
      fare_quote = (fare_quote * 100).round if fare_quote.present?
      {
        service_id: response.data.dig('data', 'Unid'),
        status:     response.data.dig('data', 'StatusCode'),
        fare_quote: fare_quote
      }
    end

    private def url
      super("/transfers/#{transfer_id}")
    end
  end
end
