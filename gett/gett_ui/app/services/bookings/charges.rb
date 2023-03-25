module Bookings
  module Charges
    GETT_UK = {
      vatable: %i(
        stops_fee additional_fee run_in_fee booking_fee handling_fee
        phone_booking_fee international_booking_fee
      ),
      non_vatable: %i(
        fare_cost paid_waiting_time_fee extra1 extra2 extra3 tips
      ),
      cancellation_vatable: %i(
        cancellation_fee
      ),
      cancellation_non_vatable: %i(
        paid_waiting_time_fee
      )
    }.freeze

    GETT_INTL = {
      vatable: GETT_UK.fetch(:vatable),
      non_vatable: GETT_UK.fetch(:non_vatable),
      cancellation_vatable: [],
      cancellation_non_vatable: %i(
        cancellation_fee paid_waiting_time_fee
      )
    }.freeze

    OT = {
      vatable: %i(
        fare_cost handling_fee booking_fee phone_booking_fee
        paid_waiting_time_fee run_in_fee extra1
      ),
      non_vatable: %i(
        tips
      ),
      cancellation_vatable: %i(
        cancellation_fee
      ),
      cancellation_non_vatable: []
    }.freeze

    GET_E = {
      vatable: %i(
        handling_fee booking_fee phone_booking_fee run_in_fee
        international_booking_fee
      ),
      non_vatable: %i(
        fare_cost tips
      ),
      cancellation_vatable: %i(
        cancellation_fee
      ),
      cancellation_non_vatable: []
    }.freeze

    VIA = {
      vatable: %i(
        fare_cost paid_waiting_time_fee extra1 extra2 extra3
        stops_fee additional_fee run_in_fee handling_fee
        booking_fee phone_booking_fee
      ),
      non_vatable: %i(tips),
      cancellation_vatable: %i(cancellation_fee paid_waiting_time_fee),
      cancellation_non_vatable: []
    }.freeze

    CAREY = GET_E

    SPLYT = GET_E

    FEES = {
      ride: %i(
        fare_cost
        cancellation_fee
      ),
      service: %i(
        handling_fee
        booking_fee
        phone_booking_fee
        international_booking_fee
      ),
      extra: %i(
        paid_waiting_time_fee
        stops_fee
        tips
        run_in_fee
        additional_fee
        extra1
        extra2
        extra3
      )
    }.freeze

    module_function

    def charges_for(booking)
      return VIA if booking.via?

      case booking.service_type
      when 'gett' then booking.international? ? GETT_INTL : GETT_UK
      when 'ot' then OT
      when 'get_e' then GET_E
      when 'carey' then CAREY
      when 'splyt' then SPLYT
      else GETT_UK
      end
    end

    def vatable_fees(booking)
      charges_for(booking).fetch(:vatable)
    end

    def non_vatable_fees(booking)
      charges_for(booking).fetch(:non_vatable)
    end

    def vatable_cancellation_fees(booking)
      charges_for(booking).fetch(:cancellation_vatable)
    end

    def non_vatable_cancellation_fees(booking)
      charges_for(booking).fetch(:cancellation_non_vatable)
    end

    def ride_fees
      FEES.fetch(:ride)
    end

    def service_fees
      FEES.fetch(:service)
    end

    def extra_fees
      FEES.fetch(:extra)
    end

    def vatable_ride_fees(booking)
      (vatable_fees(booking) | vatable_cancellation_fees(booking)) & ride_fees
    end

    def non_vatable_ride_fees(booking)
      (non_vatable_fees(booking) | non_vatable_cancellation_fees(booking)) & ride_fees
    end

    def vatable_extra_fees(booking)
      (vatable_fees(booking) | vatable_cancellation_fees(booking)) & extra_fees
    end

    def non_vatable_extra_fees(booking)
      (non_vatable_fees(booking) | non_vatable_cancellation_fees(booking)) & extra_fees
    end
  end
end
