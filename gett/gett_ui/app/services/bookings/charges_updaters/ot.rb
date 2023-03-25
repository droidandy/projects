module Bookings
  module ChargesUpdaters
    class OT < Base
      WAITING_FEE = 43 # £0.43 per minute, first 15 minutes free
      private_constant :WAITING_FEE

      def execute!
        update_pricing_rule_fare_quote
        result { save_model(charges, calculated_charges_with_totals) }

        if success?
          pay_for_booking!
          Faye.bookings.notify_update(booking)
        end
      end

      private def calculated_charges
        return calculated_cancellation_charges if booking.cancelled?

        {
          fare_cost: fare_cost,
          handling_fee: handling_fee(fare_cost),
          booking_fee: booking_fee,
          free_waiting_time: 0,
          paid_waiting_time: waiting_time,
          paid_waiting_time_fee: (waiting_time / 1.minute).round * WAITING_FEE,
          phone_booking_fee: phone_booking_fee,
          tips: tips(fare_cost),
          run_in_fee: run_in_fee,
          extra1: booking.ot_extra_cost
        }.tap do |fees|
          non_vatable_amount = sum_charges(:non_vatable_fees, fees)
          vatable_amount = sum_charges(:vatable_fees, fees)

          fees[:vat] = (vatable_amount * vat_rate).round
          fees[:total_cost] = non_vatable_amount + vatable_amount + fees[:vat]
        end
      end

      private def calculated_cancellation_charges
        return cancellation_attrs unless booking.cancellation_fee

        cancellation_attrs.tap do |fees|
          fees[:cancellation_fee] = cancellation_fee

          non_vatable_amount = sum_charges(:non_vatable_cancellation_fees, fees)
          vatable_amount = sum_charges(:vatable_cancellation_fees, fees)

          fees[:vat] = (vatable_amount * vat_rate).round
          fees[:total_cost] = non_vatable_amount + vatable_amount + fees[:vat]
        end
      end

      private def waiting_time
        @waiting_time ||= booking.ot_waiting_time || 0
      end

      private def cancellation_fee
        return @cancellation_fee if defined?(@cancellation_fee)

        percentage = {
          before_arrival: company_info.cancellation_before_arrival_fee,
          after_arrival: company_info.cancellation_after_arrival_fee
        }.fetch(cancellation_fee_type, 0)

        @cancellation_fee = (fare_cost * percentage / 100).round
      end
    end
  end
end
