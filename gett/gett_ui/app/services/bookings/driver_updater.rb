require 'waypoint'

module Bookings
  class DriverUpdater < ApplicationService
    include ::ApplicationService::ModelMethods

    attributes :booking, :params

    def execute!
      return if params.blank?

      result do
        save_model(driver, params,
          path_points: path_points,
          distance: distance,
          eta: eta,
          pickup_distance: driver.pickup_distance || distance,
          location_updated_at: location_updated_at,
          phv_license: phv_license
        )
      end
    end

    private def driver
      @driver ||= booking.driver || booking.build_driver
    end

    private def distance
      return unless (booking.on_the_way? || booking.in_progress?) && find_distance_result.present?

      if find_distance_result.distance_measure&.include?('mi')
        (find_distance_result.distance * BookingDriver::FEET_IN_MILE).round
      else
        find_distance_result.distance
      end
    end

    private def eta
      return @eta if defined?(@eta)

      @eta =
        if booking.asap?
          find_distance_result.presence && (find_distance_result.duration_sec.to_f / 60).round
        else
          ((booking.scheduled_at.to_time - Time.current) / 1.minute).round
        end

      @eta = 1 if @eta && @eta < 0
      @eta
    end

    private def find_distance_result
      return unless lat.present? && lng.present?
      return @find_distance_result if defined? @find_distance_result

      target = booking.on_the_way? ? booking.pickup_address : booking.destination_address

      @find_distance_result = target.presence && GoogleApi.find_distance(target, [lat, lng])
    end

    private def path_points
      return driver.path_points unless (booking.on_the_way? || booking.in_progress?) && lat.present? && lng.present?

      path_points = driver.path_points || []
      last_point  = path_points.last
      new_point   = Waypoint.build(
        lat: lat.to_f,
        lng: lng.to_f,
        bearing: params.stringify_keys['bearing'].to_i,
        status: booking.status
      )

      (last_point == new_point) ? path_points : path_points + [new_point]
    end

    private def last_path_point
      (driver.path_points || []).last
    end

    private def lat
      params.stringify_keys['lat']
    end

    private def lng
      params.stringify_keys['lng']
    end

    private def location_updated_at
      location_changed? ? Time.current : driver.location_updated_at
    end

    private def field_changed?(field)
      self_value = params.stringify_keys[field]
      driver_value = driver.public_send(field)

      return false if self_value.nil?
      return true if driver_value.nil?

      round_number = driver_value.to_s.split('.')[1].length
      self_value.to_f.round(round_number) != driver_value
    end

    private def location_changed?
      field_changed?('lat') || field_changed?('lng')
    end

    private def phv_license
      params.stringify_keys['phv_license'] || driver.phv_license
    end
  end
end
