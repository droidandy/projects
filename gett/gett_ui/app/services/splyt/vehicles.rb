module Splyt
  class Vehicles < ApplicationService
    attributes :attrs, :allowed_services

    def can_execute?
      allowed_services.include?(:splyt)
    end

    def as_vehicles
      return [] unless success?

      result.map do |vehicle_data|
        car_type = vehicle_data[:car_type]
        vehicle  = vehicles_by_value[car_type]

        next if vehicle.blank?
        next if vehicle_data[:estimate_id].blank?

        {
          name:                    vehicle.name,
          value:                   vehicle.value,
          price:                   vehicle_data[:lower_price],
          eta:                     vehicle_data[:eta],
          supplier:                vehicle_data[:supplier],
          quote_id:                vehicle_data[:provider_id],
          region_id:               vehicle_data[:region_id],
          estimate_id:             vehicle_data[:estimate_id],
          supports_driver_message: vehicle_data[:supports_driver_message],
          supports_flight_number:  vehicle_data[:supports_flight_number]
        }
      end.compact
    end

    private def vehicles_by_value
      @vehicles_by_value ||= ::Vehicle.splyt.to_hash(:value)
    end

    private def execute!
      sorted_vehicles_data.uniq { |vehicle| vehicle[:car_type] }
    end

    private def sorted_vehicles_data
      @sorted_vehicles_data ||=
        vehicles_with_estimate_data.sort_by do |vehicle|
          [vehicle[:car_type], vehicle[:eta], vehicle[:lower_price]]
        end
    end

    private def vehicles_with_estimate_data
      @vehicles_with_estimate_data ||=
        vehicles_data.map do |vehicle|
          Thread.new { fail_safe(silence: true) { vehicle_with_estimate(vehicle) } }
        end.map(&:value).compact
    end

    private def vehicles_data
      @vehicles_data ||=
        providers.flat_map do |provider|
          provider[:car_types].map do |car_type|
            vehicle_data(provider, car_type)
          end
        end
    end

    private def providers
      @providers ||=
        Providers.new(pickup_address: attrs[:pickup_address], booking_type: booking_type)
          .execute
          .normalized_response
          .fetch(:providers, [])
    end

    private def booking_type
      asap_booking? ? BookingTypes::ASAP : BookingTypes::FUTURE
    end

    private def asap_booking?
      attrs[:scheduled_type] == 'now'
    end

    private def vehicle_data(provider, car_type)
      {
        supplier:                provider[:supplier],
        provider_id:             provider[:provider_id],
        car_type:                car_type,
        region_id:               provider[:region_id],
        supports_driver_message: provider[:supports_driver_message],
        supports_flight_number:  provider[:supports_flight_number]
      }
    end

    private def vehicle_with_estimate(vehicle)
      vehicle.merge(
        estimate(vehicle)
      )
    end

    private def estimate(vehicle)
      Estimate.new(estimate_data(vehicle)).execute.normalized_response
    end

    private def estimate_data(vehicle)
      {
        provider_id:     vehicle[:provider_id],
        region_id:       vehicle[:region_id],
        car_type:        vehicle[:car_type],
        pickup_address:  attrs[:pickup_address].slice(:lat, :lng),
        dropoff_address: attrs[:destination_address].slice(:lat, :lng),
        booking_type:    booking_type
      }.tap do |params|
        params[:departure_date] = departure_date if future_booking?
      end
    end

    private def future_booking?
      !asap_booking?
    end

    private def departure_date
      attrs[:scheduled_at]&.change(sec: 0)&.iso8601
    end
  end
end
