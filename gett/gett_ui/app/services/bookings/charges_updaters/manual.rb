module Bookings
  module ChargesUpdaters
    class Manual < Base
      WAITING_FEE = 50 # £0.50 per minute, first 15 minutes free
      private_constant :WAITING_FEE

      def execute!
        result { save_model(charges, calculated_charges) }

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
          run_in_fee: run_in_fee
        }.tap do |json|
          all_fees = (
            json[:handling_fee] +
            json[:booking_fee] +
            json[:paid_waiting_time_fee] +
            json[:phone_booking_fee] +
            json[:tips] +
            json[:run_in_fee]
          ).round

          json[:vat] = ((fare_cost + all_fees) * vat_rate).round
          json[:total_cost] = json[:fare_cost] + all_fees + json[:vat]
        end
      end

      private def calculated_cancellation_charges
        return cancellation_attrs unless booking.cancellation_fee

        vat = (cancellation_fee * vat_rate).round
        cancellation_attrs.merge(
          cancellation_fee: cancellation_fee,
          vat: vat,
          total_cost: cancellation_fee + vat
        )
      end

      private def waiting_time
        0
      end

      private def cancellation_fee
        0
      end
    end
  end
end
