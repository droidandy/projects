module MockServices
  class CareyMock < Base
    def self.match_urls
      [URI(Settings.carey.wsdl_url).host]
    end

    def service_name
      'carey'
    end

    def erb_parameters
      {void: nil}
    end

    def request_type
      if params.wsdl
        'wsdl'
      elsif URI(request.uri).path == '/CSIOTAProxy_v2/CareyReservationService'
        web_service_type
      end
    end

    def web_service_type
      body = xml_body_to_openstruct.dig(:Envelope, :Body)
      action = body.to_h.keys.first
      action.to_s.underscore
    end
  end
end
