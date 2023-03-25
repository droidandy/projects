module MockServices
  class ViaMock < Base
    URI_MAPPINGS = {
      oauth: Settings.via.oauth2_host,
      eta:   Settings.via.api_url
    }.freeze

    def self.match_urls
      URI_MAPPINGS.values
    end

    def service_name
      'via'
    end

    def erb_parameters
      { void: nil }
    end

    def request_type
      if oauth?
        'oauth'
      elsif eta?
        'eta'
      end
    end

    private def oauth?
      URI(request.uri).host == URI(URI_MAPPINGS[:oauth]).host
    end

    private def eta?
      URI(request.uri).host == URI(URI_MAPPINGS[:eta]).host
    end
  end
end
