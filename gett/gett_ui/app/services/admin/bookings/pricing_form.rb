module Admin::Bookings
  class PricingForm < ApplicationService
    attributes :booking

    delegate :company, to: :booking

    CHARGES_FIELDS = %i(
      fare_cost
      handling_fee
      booking_fee
      paid_waiting_time_fee
      stops_fee
      phone_booking_fee
      tips
      vat
      total_cost
      cancellation_fee
      run_in_fee
      additional_fee
      extra1
      extra2
      extra3
      international_booking_fee
    ).freeze

    def execute!
      {
        bookers: bookers_data,
        form: form_data,
        can: { edit: !booking.billed? },
        fees: fees,
        vat_rate: Settings.vat_rate,
        fare_quote: fare_quote
      }
    end

    private def form_data
      {
        booking: booking.as_json(only: [:id, :status, :booker_id, :indicated_status]),
        charges: charges_data
      }
    end

    private def bookers_data
      company.bookers.dup.unshift(booking.booker).uniq(&:id).as_json(only: [:id], include: [:full_name])
    end

    private def charges
      @charges ||= booking.charges || booking.build_charges
    end

    private def charges_data
      charges.as_json(only: CHARGES_FIELDS).transform_values do |amount_cents|
        (amount_cents.to_f / 100).round(2)
      end
    end

    private def fare_quote
      (booking.fare_quote.to_f / 100).round(2)
    end

    private def fees
      {
        completed: {
          vatable: Bookings::Charges.vatable_fees(booking),
          non_vatable: Bookings::Charges.non_vatable_fees(booking)
        },
        cancelled: {
          vatable: Bookings::Charges.vatable_cancellation_fees(booking),
          non_vatable: Bookings::Charges.non_vatable_cancellation_fees(booking)
        }
      }
    end
  end
end
