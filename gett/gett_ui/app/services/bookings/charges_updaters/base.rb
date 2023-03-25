module Bookings
  module ChargesUpdaters
    class Base < ApplicationService
      include ApplicationService::ModelMethods
      FREE_CANCELLATION_THRESHOLD = 3.hours

      attributes :booking
      delegate :company_info, to: :booking
      delegate :vatable?, to: :booking, prefix: true

      private def fare_cost
        booking.fare_quote
      end

      private def charges
        @charges ||= booking.charges || booking.build_charges
      end

      private def pay_for_booking!
        fail_safe { BookingPayments::Create.new(booking: booking).execute }
      end

      private def cancellation_attrs
        {
          fare_cost: 0,
          handling_fee: 0,
          booking_fee: 0,
          phone_booking_fee: 0,
          tips: 0,
          run_in_fee: 0,
          international_booking_fee: 0,
          cancellation_fee: 0,
          vat: 0,
          total_cost: 0
        }
      end

      private def international_booking_fee_ratio
        (booking.international? ? company_info.international_booking_fee : 0) / 100
      end

      private def vat_rate
        booking_vatable? ? Settings.vat_rate : 0
      end

      private def phone_booking_fee
        return @phone_booking_fee if defined? @phone_booking_fee

        @phone_booking_fee = booking.phone_booking? ? (company_info.phone_booking_fee * 100).round : 0
      end

      private def tips(fare_cost)
        (fare_cost * (company_info.tips || 0) / 100).round
      end

      private def run_in_fee
        @run_in_fee ||= (company_info.run_in_fee || 0) * 100
      end

      private def international_booking_fee(fare_cost)
        @international_booking_fee ||=
          (fare_cost * international_booking_fee_ratio).round
      end

      private def handling_fee(fare_cost)
        (fare_cost * (company_info.handling_fee || 0) / 100).round
      end

      private def booking_fee
        @booking_fee ||= (company_info.booking_fee || 0) * 100
      end

      private def cancellation_fee_type
        return @cancellation_fee_type if defined?(@cancellation_fee_type)

        @cancellation_fee_type =
          if cancelled_after_arrival?
            :after_arrival
          elsif cancelled_before_arrival?
            :before_arrival
          end
      end

      private def cancelled_after_arrival?
        booking.status_before_cancellation == 'arrived'
      end

      private def cancelled_before_arrival?
        # for asap orders before_arrival cancellation is the case only when driver is already assigned
        cancelled_at = (
          booking.cancelled_at ||
          booking.cancellation_requested_at ||
          booking.created_at
        ).to_time

        (booking.scheduled_at.to_time - cancelled_at) < FREE_CANCELLATION_THRESHOLD &&
          (booking.future? || booking.driver_assigned?)
      end

      private def calculated_charges_with_totals
        charges_without_totals = calculated_charges

        vatable_ride_fees = sum_charges(:vatable_ride_fees, charges_without_totals)
        non_vatable_ride_fees = sum_charges(:non_vatable_ride_fees, charges_without_totals)
        service_fees = sum_charges(:service_fees, charges_without_totals)
        vatable_extra_fees = sum_charges(:vatable_extra_fees, charges_without_totals)
        non_vatable_extra_fees = sum_charges(:non_vatable_extra_fees, charges_without_totals)

        charges_without_totals.merge(
          vatable_ride_fees: vatable_ride_fees,
          non_vatable_ride_fees: non_vatable_ride_fees,
          service_fees: service_fees,
          vatable_extra_fees: vatable_extra_fees,
          non_vatable_extra_fees: non_vatable_extra_fees
        )
      end

      private def update_pricing_rule_fare_quote
        assert { PricingRules::UpdateBooking.new(booking: booking).execute.success? }
      end

      private def sum_charges(type, charges)
        fields =
          if type.in?(%i(ride_fees service_fees extra_fees))
            Bookings::Charges.public_send(type)
          else
            Bookings::Charges.public_send(type, booking)
          end
        charges.values_at(*fields).sum(&:to_i)
      end
    end
  end
end
