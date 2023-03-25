module MockServices
  class PaymentsosMock < Base
    def self.match_urls
      [URI(Settings.payments_os.api_url).host]
    end

    def service_name
      'paymentsos'
    end

    def erb_parameters
      {void: nil}
    end

    def request_type
      case URI(request.uri).path
      when /authorizations/
        'authorizations'
      when /charges/
        'charges'
      when /captures/
        'captures'
      when /payments$/
        'payments'
      when /payments/
        'details'
      end
    end
  end
end
