module MockServices
  class OneTransportMock < Base
    def self.match_urls
      [URI(Settings.ot.wsdl_url).host]
    end

    def service_name
      'one_transport'
    end

    def erb_parameters
      if request_type == 'job_quote'
        { price: mock_data.fetch(:price, nil) }
      else
        { status: 'Prebooked' }
      end
    end

    def request_type
      if params.wsdl
        'wsdl'
      elsif URI(request.uri).path == '/OTWS/OTWebservice.asmx'
        web_service_type
      end
    end

    private def web_service_type
      body = xml_body_to_openstruct.dig(:Envelope, :Body)
      # Body has only one key
      action = body.to_h.keys.first
      action.to_s.underscore
    end
  end
end
