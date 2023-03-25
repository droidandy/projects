module Gett
  class Products < Base
    VERIFICATION_PARAMS = {latitude: '51.528308', longitude: '-0.3817961'}.freeze
    private_constant :VERIFICATION_PARAMS

    http_method :get
    attributes :address, :gett_business_id, :verify_business_id

    fetch_business_id_from { address[:country_code] }

    def execute!
      super
      assert { response&.data&.present? }
    end

    def normalized_response
      products = response&.data&.with_indifferent_access.try(:[], :products) || []
      products.map{ |product| product_to_vehicle(product) }.compact
    end

    private def url
      super("/business/products")
    end

    private def params
      product_location.merge(business_id: product_business_id)
    end

    private def product_business_id
      verify_business_id || gett_business_id || business_id
    end

    private def product_location
      return VERIFICATION_PARAMS if address.blank?

      {
        latitude: address[:latitude],
        longitude: address[:longitude]
      }
    end

    private def product_to_vehicle(product)
      vehicle = gett_vehicles_ids[product[:id]]
      return if vehicle.blank?

      { value: vehicle.value, name: vehicle.name }
    end

    private def gett_vehicles_ids
      @gett_vehicles_ids ||= Vehicle.gett.to_hash(:value)
    end
  end
end
