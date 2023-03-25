module MockServices
  class OpenExchangeMock < Base
    def self.match_urls
      [Settings.open_exchange.api_url]
    end

    def service_name
      'open_exchange'
    end

    def erb_parameters
      { void: nil }
    end

    def request_type
      case URI(request.uri).path
      when %r(api/latest.json)
        'latest'
      end
    end
  end
end
