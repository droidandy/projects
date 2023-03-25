module MockServices
  class NexmoMock < Base
    def self.match_urls
      ['rest.nexmo.com']
    end

    def service_name
      'nexmo'
    end

    def erb_parameters
      { void: nil }
    end

    def request_type
      case URI(request.uri).path
      when /sms/
        'sms'
      end
    end
  end
end
