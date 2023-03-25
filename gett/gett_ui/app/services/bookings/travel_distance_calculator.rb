module Bookings
  class TravelDistanceCalculator < ApplicationService
    include ::ApplicationService::ModelMethods

    attributes :booking, :pickup, :stops, :destination

    def execute!
      return if addresses.compact.length < 2

      total_distance = 0
      total_duration = 0

      addresses[0...-1].each_with_index do |address, index|
        api_result = GoogleApi.find_distance(addresses[index + 1], address)
        total_distance += distance_in_miles(api_result)
        total_duration += api_result.duration_sec.to_i || 0
      end

      {
        distance: total_distance.round(2),
        duration: (total_duration / 60).round
      }
    end

    private def distance_in_miles(api_result)
      return 0 unless api_result.success?

      if api_result.distance_measure&.include?('feet')
        api_result.distance / BookingDriver::FEET_IN_MILE
      else
        api_result.distance
      end
    end

    private def addresses
      @addresses ||=
        [pickup_address] + stop_addresses + [destination_address]
    end

    private def pickup_address
      booking&.pickup_address || pickup
    end

    private def stop_addresses
      booking&.stop_addresses || stops || []
    end

    private def destination_address
      booking&.destination_address || destination
    end
  end
end
