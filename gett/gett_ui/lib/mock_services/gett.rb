module MockServices
  class GettMock < Base
    def self.match_urls
      [Settings.gt.api_url]
    end

    def service_name
      'gett_api'
    end

    def erb_parameters
      {
        status: mock_data.fetch(:status, 'Routing')
      }
    end

    def request_type
      case URI(request.uri).path
      when /oauth/
        'oauth'
      when %r(business/products)
        'products'
      when %r(business/price)
        'price'
      when %r(business/rides/\d*/cancel)
        'ride_cancel'
      when %r(business/rides/\d*/receipt)
        'ride_receipt'
      when %r(business/rides/\d+)
        'ride_details'
      when %r(business/rides)
        'rides'
      when %r(business/eta)
        'eta'
      end
    end
  end
end
