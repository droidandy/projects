module MockServices
  class ExperianMock < Base
    def self.match_urls
      [Settings.experian.api_url]
    end

    def service_name
      'experian'
    end

    def erb_parameters
      { void: nil }
    end

    def request_type
      case URI(request.uri).path
      when %r(oauth2/v1/token)
        'oauth'
      when %r(risk/business/v1/registeredcompanycredit)
        'registeredcompanycredit'
      end
    end
  end
end
