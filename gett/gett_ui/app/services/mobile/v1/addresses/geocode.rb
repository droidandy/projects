module Mobile::V1
  module Addresses
    class Geocode < ApplicationService
      attributes :location_id, :string, :google, :predefined, :lat, :lng

      def execute!
        return unless geocoding_service.execute.success?

        geocoding_service.result.tap do |result|
          result[:airport] = result.delete(:airport_iata)
        end
      end

      private def geocoding_service
        @geocoding_service ||= ::Addresses::Geocode.new(**attributes.symbolize_keys)
      end
    end
  end
end
