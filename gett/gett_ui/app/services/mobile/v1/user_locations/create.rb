module Mobile::V1
  module UserLocations
    class Create < ApplicationService
      include ApplicationService::ModelMethods

      attributes :user, :point

      def execute!
        save_model(location)
      end

      private def location
        @location ||= UserLocation.new(user: user, lat: point[:lat], lng: point[:lng])
      end
    end
  end
end
