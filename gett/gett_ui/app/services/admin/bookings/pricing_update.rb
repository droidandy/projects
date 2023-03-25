module Admin::Bookings
  class PricingUpdate < ApplicationService
    include ApplicationService::ModelMethods

    BLANK_CHARGES_PARAMS = {
      fare_cost: 0,
      handling_fee: 0,
      booking_fee: 0,
      paid_waiting_time_fee: 0,
      stops_fee: 0,
      phone_booking_fee: 0,
      tips: 0,
      cancellation_fee: 0,
      run_in_fee: 0,
      additional_fee: 0,
      extra1: 0,
      extra2: 0,
      extra3: 0,
      international_booking_fee: 0
    }.freeze

    attributes :booking, :params

    def execute!
      return if booking.billed?

      transaction do
        booking.lock!
        result { update_model(booking, params[:booking]) }
        assert { set_charges_service.execute.success? }
        assert { update_model(booking, fare_quote: booking.charges.fare_cost) }
      end
    end

    def show_result
      Admin::Bookings::Show.new(booking: booking).execute.result
    end

    private def set_charges_service
      @set_charges_service ||= Bookings::SetCharges.new(
        booking: booking,
        params: charges_params
      )
    end

    private def charges_params
      params[:charges]
        .transform_keys { |key| key.to_s.sub(/extra_(\d)/, 'extra\1') }
        .transform_values { |amount| (amount.to_f * 100).round }
        .symbolize_keys
        .slice(*permitted_fees)
        .reverse_merge(BLANK_CHARGES_PARAMS)
        .merge(manual: true)
    end

    private def permitted_fees
      return [] if booking.rejected? || booking.customer_care?

      if booking.cancelled?
        Bookings::Charges.vatable_cancellation_fees(booking) +
          Bookings::Charges.non_vatable_cancellation_fees(booking)
      else
        Bookings::Charges.vatable_fees(booking) +
          Bookings::Charges.non_vatable_fees(booking)
      end
    end
  end
end
