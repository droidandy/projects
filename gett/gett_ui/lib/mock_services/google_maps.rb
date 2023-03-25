module MockServices
  class GoogleMapsMock < Base
    URI_MAPPINGS = {
      autocomplete: Settings.google_api.autocomplete_url,
      details:      Settings.google_api.details_url,
      distance:     Settings.google_api.distancematrix_url
    }.freeze

    def self.match_urls
      URI_MAPPINGS.values
    end

    def service_name
      'google_maps'
    end

    def erb_parameters
      case request_type
      when 'autocomplete'
        input = params.input.first
        { input: "#{mock_data.fetch(:input, input)} One" }
      when 'details'
        {
          address: '221B Baker St, Marylebone, London NW1 6XE, UK',
          country: 'United Kingdom',
          country_code: 'GB',
          region:  'England',
          lat:     51.523767,
          lng:     -0.1585557
        }.merge(mock_data)
      when 'distance_matrix'
        { distance: mock_data.fetch(:distance, nil) }
      else
        { void: nil }
      end
    end

    def request_type
      if autocomplete?
        'autocomplete'
      elsif details?
        'details'
      elsif distance_matrix?
        'distance_matrix'
      end
    end

    private def autocomplete?
      request.uri.match(URI(URI_MAPPINGS[:autocomplete]).path)
    end

    private def details?
      request.uri.match(URI(URI_MAPPINGS[:details]).path)
    end

    private def distance_matrix?
      request.uri.match(URI(URI_MAPPINGS[:distance]).path)
    end
  end
end
