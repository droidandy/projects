module Addresses
  class PredefinedGeocode < ApplicationService
    attributes :line

    def execute!
      {
        formatted_address: line,
        airport_iata: matched_address.airport&.iata
      }.merge!(
        matched_address.values.slice(
          :postal_code, :lat, :lng, :country_code, :timezone, :city, :region, :street_name, :street_number, :point_of_interest
        )
      )
    end

    private def matched_address
      @matched_address ||= PredefinedAddress.find_exactly(line)
    end
  end
end
