module Bookings
  class SetCharges < ApplicationService
    include ApplicationService::ModelMethods

    attributes :booking, :params

    def execute!
      charges.set(params)
      calculate_total_cost
      calculate_fees_totals
      save_model(charges)
    end

    private def charges
      @charges ||= booking.charges || booking.build_charges
    end

    private def calculate_total_cost
      if booking.cancelled?
        vatable_amount = sum_charges(:vatable_cancellation_fees)
        non_vatable_amount = sum_charges(:non_vatable_cancellation_fees)
      else
        vatable_amount = sum_charges(:vatable_fees)
        non_vatable_amount = sum_charges(:non_vatable_fees)
      end

      charges.vat = (vatable_amount * vat_rate).round
      charges.total_cost = vatable_amount + non_vatable_amount + charges.vat
    end

    private def calculate_fees_totals
      charges.vatable_ride_fees = sum_charges(:vatable_ride_fees)
      charges.non_vatable_ride_fees = sum_charges(:non_vatable_ride_fees)
      charges.service_fees = sum_charges(:service_fees)
      charges.vatable_extra_fees = sum_charges(:vatable_extra_fees)
      charges.non_vatable_extra_fees = sum_charges(:non_vatable_extra_fees)
    end

    private def vat_rate
      booking.vatable? ? Settings.vat_rate : 0
    end

    private def sum_charges(type)
      fields =
        if type.in?(%i(ride_fees service_fees extra_fees))
          Bookings::Charges.public_send(type)
        else
          Bookings::Charges.public_send(type, booking)
        end
      charges.values.values_at(*fields).sum(&:to_i)
    end
  end
end
