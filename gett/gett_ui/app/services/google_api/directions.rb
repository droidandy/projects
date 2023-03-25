module GoogleApi
  class Directions < Base
    # Documentation:
    # https://developers.google.com/maps/documentation/directions/intro

    http_method :get
    attributes :origin, :destination, :waypoints

    normalize_response do
      map from('/routes[0]/overview_polyline/points'), to('/direction')
      map from('status'), to('/status')
    end

    def execute!
      super

      assert { result[:status] == 'OK' } unless result.nil?
    end

    private def url
      params =
        { origin: origin, destination: destination }.tap do |p|
          p[:waypoints] = formatted_waypoints if formatted_waypoints.present?
        end

      url_for(Settings.google_api.directions_url, params)
    end

    private def formatted_waypoints
      @formatted_waypoints ||= waypoints.map(&:to_s).join('|')
    end
  end
end
