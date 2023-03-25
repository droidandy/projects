module PricingRules
  class UpdateBooking < ApplicationService
    include ApplicationService::ModelMethods

    attributes :booking

    def execute!
      if booking.as_directed?
        update_model(booking, pricing_rule_fare_quote: nil)
      else
        update_model(booking, pricing_rule_fare_quote: calculate_price_service.execute.result)
      end
    end

    private def calculate_price_service
      @calculate_price_service ||= PricingRules::CalculatePrice.new(
        company: booking.company,
        vehicle_type: booking.vehicle.name,
        pickup: booking.pickup_address.values.slice(:lat, :lng),
        destination: booking.destination_address.values.slice(:lat, :lng),
        distance: booking.travel_distance,
        has_stops: booking.stop_addresses.any?,
        asap: booking.asap?,
        scheduled_at: booking.scheduled_at.in_time_zone(booking.timezone)
      )
    end
  end
end
