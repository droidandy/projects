module Splyt
  class UpdateEstimate < ApplicationService
    include ApplicationService::ModelMethods

    attributes :booking

    private def execute!
      update_model(booking, estimate_id: estimate_id)
    end

    private def estimate_id
      estimate_service.execute.normalized_response.fetch(:estimate_id)
    end

    private def estimate_service
      @estimate_service ||= Splyt::Estimate.new(estimate_params)
    end

    private def estimate_params
      {
        provider_id:     booking.quote_id,
        region_id:       booking.region_id,
        car_type:        booking.vehicle.value,
        booking_type:    booking_type,
        pickup_address:  booking.pickup_address.to_h.slice(:lat, :lng),
        dropoff_address: booking.destination_address.to_h.slice(:lat, :lng)
      }.tap do |params|
        params[:departure_date] = departure_date if booking.future?
      end
    end

    private def booking_type
      booking.asap? ? Splyt::BookingTypes::ASAP : Splyt::BookingTypes::FUTURE
    end

    private def departure_date
      booking.scheduled_at&.change(sec: 0)&.iso8601
    end
  end
end
