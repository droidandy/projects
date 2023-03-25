module MockServices
  class GettEMock < Base
    def self.match_urls
      [Settings.get_e.api_url]
    end

    def service_name
      'get_e'
    end

    def erb_parameters
      { void: nil }
    end

    def request_type
      case URI(request.uri).path
      when /quotes/
        'quotes'
      when /transfers/
        'transfers'
      end
    end
  end
end
