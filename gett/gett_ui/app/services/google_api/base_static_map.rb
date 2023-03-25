module GoogleApi
  class BaseStaticMap < ApplicationService
    attributes :booking, :size, :scale

    ASSET_HOST = Rails.application.config.action_mailer.asset_host.freeze
    DEFAULT_MAP_SIZE = '600x250'.freeze
    DEFAULT_MAP_SCALE = 1

    private_constant :DEFAULT_MAP_SIZE, :ASSET_HOST

    delegate :pickup_address, :destination_address, :stop_addresses, :driver, to: :booking

    def execute!
      width, height = map_size.split('x').map(&:to_i)

      map = GoogleStaticMap.new(
        markers: markers,
        paths: [path].compact,
        width: width,
        height: height,
        scale: map_scale,
        **credentials
      )

      map.url('https')
    end

    private def credentials
      {
        client_id: Settings.google_api.client_id,
        private_key: Settings.google_api.private_key
      }
    end

    private def path
      if driver&.in_progress_path_points.present? && driver.in_progress_path_points.size > 2
        MapPath.new(points: path_points, color: self.class::MARKER_COLOR, weight: 3)
      elsif destination_address.present? && encoded_path.present?
        MapPath.new(enc: encoded_path, color: self.class::MARKER_COLOR, weight: 3)
      end
    end

    private def encoded_path
      return @encoded_path if defined?(@encoded_path)

      @encoded_path =
        GoogleApi.fetch_direction(
          from:      MapLocation.new(latitude: pickup_address.lat, longitude: pickup_address.lng),
          to:        MapLocation.new(latitude: destination_address.lat, longitude: destination_address.lng),
          waypoints: waypoints
        ).direction
    end

    private def waypoints
      stop_addresses.map do |address|
        MapLocation.new(latitude: address.lat, longitude: address.lng)
      end
    end

    private def path_points
      path_points = [MapLocation.new(latitude: pickup_address.lat, longitude: pickup_address.lng)]

      if driver&.in_progress_path_points&.many?
        driver.in_progress_path_points.each do |lat, lng|
          path_points << MapLocation.new(latitude: lat, longitude: lng)
        end
      else
        stop_addresses.each do |address|
          path_points << MapLocation.new(latitude: address.lat, longitude: address.lng)
        end
      end

      if destination_address.present?
        path_points << MapLocation.new(latitude: destination_address.lat, longitude: destination_address.lng)
      end

      path_points
    end

    private def map_size
      size || DEFAULT_MAP_SIZE
    end

    private def map_scale
      scale || DEFAULT_MAP_SCALE
    end

    private def markers
      markers =
        stop_addresses.map.with_index do |address, i|
          MapMarker.new(
            icon: self.class::STOP_POINT_MARKER_PATH[(stop_addresses.length > 3) ? 'default' : i + 1],
            location: MapLocation.new(latitude: address.lat, longitude: address.lng),
            anchor: 'center'
          )
        end

      markers.unshift(
        MapMarker.new(
          icon: icon_path(:start),
          location: MapLocation.new(latitude: pickup_address.lat, longitude: pickup_address.lng),
          anchor: 'center'
        )
      )

      if destination_address.present?
        markers.push(
          MapMarker.new(
            icon: icon_path(:finish),
            location: MapLocation.new(latitude: destination_address.lat, longitude: destination_address.lng),
            anchor: 'center'
          )
        )
      end

      markers
    end

    private def icon_path
      fail "#{self.class.name} doesn't implement '#{__method__}'"
    end
  end
end
