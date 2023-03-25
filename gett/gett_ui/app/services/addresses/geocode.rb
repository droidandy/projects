module Addresses
  class Geocode < ApplicationService
    attributes :location_id, :string, :google, :predefined, :lat, :lng

    def initialize(**attrs)
      super

      if attrs.values_at(:lat, :lng).any? &&
          attrs.values_at(:location_id, :string, :google, :predefined).any?

        fail ArgumentError, ":lat, :lng cannot be specified alongside with geocoding attributes"
      end
    end

    def execute!
      geocoding_service.execute.result
    end

    private def geocoding_service
      @geocoding_service ||=
        if lat.present? && lng.present?
          GoogleApi::ReverseGeocode.new(lat: lat, lng: lng)
        elsif google.present?
          GoogleApi::AddressDetails.new(place_id: location_id)
        elsif predefined.present?
          Addresses::PredefinedGeocode.new(line: string)
        else
          Pcaw::Geocode.new(location_id: location_id)
        end
    end
  end
end
