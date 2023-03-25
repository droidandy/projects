module TravelRules
  class VehicleAvailability::RuleChecker < ApplicationService
    attributes :rule, :params

    delegate :min_time, :max_time, :weekdays, :min_distance, :max_distance, :location, to: :rule

    def execute!
      time_fits? && day_fits? && distance_fits? && location_fits?
    end

    private def time_fits?
      time = Sequel::SQLTime.create(requested_time.hour, requested_time.min, 0)

      (min_time..max_time).cover?(time)
    end

    private def day_fits?
      weekdays.include?(requested_date.cwday.to_s)
    end

    private def distance_fits?
      return true if min_distance.blank? && max_distance.blank?

      api_service = GoogleApi::FindDistance.new(
        origin: params[:pickup_address]&.values_at(:lat, :lng),
        destination: params[:destination_address]&.values_at(:lat, :lng)
      )

      # TODO: handle api_service availability and failed requests, maybe?

      distance = api_service.execute.distance_in_miles

      distance.nil? || (
        (min_distance.blank? || min_distance <= distance) &&
        (max_distance.blank? || max_distance >= distance)
      )
    end

    private def location_fits?
      location.blank? || TravelRules::Locations.includes?(location, **params[:pickup_address].slice(:lat, :lng).symbolize_keys)
    end

    # params[:scheduled_at] is expected to be a timezone-aware string / datetime object
    private def requested_time
      params[:scheduled_at]&.to_datetime || Time.current
    end

    def requested_date
      params[:scheduled_at]&.to_date || Date.current
    end
  end
end
