module Gett
  class Eta < Base
    http_method :get
    attributes :lat, :lng, :country_code

    fetch_business_id_from { country_code }

    private def url
      super("/business/eta")
    end

    private def params
      {
        latitude: lat,
        longitude: lng,
        business_id: business_id
      }
    end
  end
end
