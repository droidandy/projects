# https://developers.google.com/places/web-service/details
module GoogleApi
  class AddressDetails < Base
    http_method :get
    attributes :place_id

    def normalized_response
      AddressNormalizer.normalize(response.data)
    end

    private def url
      url_for(Settings.google_api.details_url, place_id: place_id)
    end
  end
end
