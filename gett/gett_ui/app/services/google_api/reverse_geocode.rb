module GoogleApi
  class ReverseGeocode < Base
    http_method :get
    attributes :lat, :lng, :address

    def normalized_response
      return unless response.success? && response.data['results'].present?

      prepared_response =
        response.data.dup.tap do |data|
          data['result'] = data.delete('results').first if data.key?('results')
        end

      AddressNormalizer.normalize(prepared_response)
    end

    private def url
      url_for(Settings.google_api.geocode_url, result_type: 'street_address|airport|premise', **params)
    end

    private def params
      if address.present?
        { address: address }
      else
        { latlng: "#{lat},#{lng}" }
      end
    end
  end
end
