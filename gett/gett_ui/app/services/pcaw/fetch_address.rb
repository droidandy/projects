module Pcaw
  class FetchAddress < Base
    attributes :location_id

    normalize_response do
      map from('/Items[0]/PostalCode'), to('/postal_code')
      map from('/Items[0]/CountryIso2'), to('/country_code')
      map from('/Items[0]/City'), to('/city')
      map from('/Items[0]/Street'), to('/street_name')
      map from('/Items[0]/BuildingNumber'), to('/street_number')
      map from('/Items[0]'), to('/formatted_address') do |addr|
        [
          addr['Company'], addr['SubBuilding'],
          addr['BuildingName'], addr['BuildingNumber'],
          addr['Street'], addr['District'],
          addr['City'], addr['PostalCode']
        ].map(&:presence).compact.join(', ')
      end
    end

    def execute!
      super
      assert { result[:postal_code].present? && result[:formatted_address].present? }
    end

    private def url
      super('/Capture/Interactive/Retrieve/v1.00/json3ex.ws')
    end

    private def params
      super.merge(Id: location_id.to_s)
    end
  end
end
