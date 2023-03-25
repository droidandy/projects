module Passengers
  class CalculateExcess < ApplicationService
    include ApplicationService::Context

    delegate :company, to: :context
    delegate :travel_policy_mileage_limit, :excess_cost_per_mile, to: :company

    attributes :home_address, :work_address

    def execute!
      excess_distance = [0, distance - travel_policy_mileage_limit].max
      {
        distance: distance,
        excess_distance: excess_distance,
        cost: cost,
        excess_cost: excess_distance * excess_cost_per_mile
      }
    end

    private def cost
      result = vehicles_service.execute.result
      vehicle = result[:vehicles].first # as we request with `only: ['Standard']` option
      (vehicle&.dig(:price) || 0) / 100
    end

    private def distance
      @distance ||= distance_service.execute.result[:distance]
    end

    private def distance_service
      @distance_service ||=
        Bookings::TravelDistanceCalculator.new(
          pickup: home_address,
          destination: work_address
        )
    end

    private def vehicles_service
      @vehicles_service ||=
        Bookings::Vehicles.new(
          company: company,
          only: ['Standard'],
          params: {
            pickup_address: normalize_address(home_address),
            destination_address: normalize_address(work_address)
          }
        )
    end

    private def normalize_address(address)
      address.to_h.symbolize_keys.slice(:lat, :lng, :postal_code, :line, :country_code)
    end
  end
end
