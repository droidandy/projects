module Bookings
  module ChargesUpdaters
    class Gett < Base
      delegate :company, to: :booking
      delegate :price_with_fx_rate_increase, to: :company

      def execute!
        request_gett_receipt
        update_pricing_rule_fare_quote

        if gett_receipt.success? && calculated_charges.any?
          result { save_model(charges, calculated_charges_with_totals) }
          assert { update_model(booking, fare_quote: charges.fare_cost) }

          if success?
            pay_for_booking!
            Faye.bookings.notify_update(booking)
          end
        end
      end

      private def calculated_charges
        return {} if gett_receipt.normalized_response.blank?
        return calculated_cancellation_charges if booking.cancelled?

        gett_charges.slice(
          :fare_cost,
          :free_waiting_time,
          :paid_waiting_time,
          :paid_waiting_time_fee,
          :stops_text,
          :stops_fee,
          :additional_fee,
          :extra1,
          :extra2,
          :extra3,
          :tips
        ).tap do |fees|
          fees[:fare_cost] =
            booking.pricing_rule_fare_quote || price_with_fx_rate_increase(fees[:fare_cost] || 0, international: booking.international?)
          fees[:handling_fee] = handling_fee(fees[:fare_cost])
          fees[:booking_fee] = booking_fee
          fees[:phone_booking_fee] = phone_booking_fee
          fees[:run_in_fee] = run_in_fee
          fees[:international_booking_fee] = international_booking_fee(fees[:fare_cost]) if booking.international?

          non_vatable_amount = fees
            .values_at(*Bookings::Charges.non_vatable_fees(booking))
            .sum(&:to_i)

          vatable_amount = fees
            .values_at(*Bookings::Charges.vatable_fees(booking))
            .sum(&:to_i)

          fees[:vat] = (vatable_amount * vat_rate).round
          fees[:total_cost] = non_vatable_amount + vatable_amount + fees[:vat]
        end
      end

      private def handling_fee(fare_cost)
        booking.via? ? super : (gett_charges[:handling_fee] || 0)
      end

      private def booking_fee
        booking.via? ? super : (gett_charges[:booking_fee] || 0)
      end

      private def calculated_cancellation_charges
        return cancellation_attrs unless booking.cancellation_fee

        response_attrs =
          gett_charges.slice(
            :free_waiting_time,
            :paid_waiting_time,
            :paid_waiting_time_fee
          ).tap do |fees|
            fees[:cancellation_fee] = cancellation_fee

            non_vatable_amount = fees
              .values_at(*Bookings::Charges.non_vatable_cancellation_fees(booking))
              .sum(&:to_i)

            vatable_amount = fees
              .values_at(*Bookings::Charges.vatable_cancellation_fees(booking))
              .sum(&:to_i)

            fees[:vat] = (vatable_amount * vat_rate).round
            fees[:total_cost] = non_vatable_amount + vatable_amount + fees[:vat]
          end

        cancellation_attrs.merge(response_attrs)
      end

      private def request_gett_receipt
        gett_receipt.with_context(company: company).execute do |on|
          request = Request.new(service_provider: 'gett', subject_gid: booking.to_gid.to_s)

          on.request do |url|
            create_model(request, url: url, status: :sent)
          end

          on.success do
            update_model(request, response_payload: gett_receipt.normalized_response, status: :processed)
          end
        end
      end

      private def gett_receipt
        @gett_receipt ||= ::Gett::Receipt.new(booking: booking)
      end

      private def gett_charges
        @gett_charges ||= gett_receipt.normalized_response&.[](:charges) || Hash.new(0)
      end

      private def cancellation_fee
        return @cancellation_fee if defined?(@cancellation_fee)

        fee = {
          before_arrival: company_info.gett_cancellation_before_arrival_fee,
          after_arrival: company_info.gett_cancellation_after_arrival_fee
        }.fetch(cancellation_fee_type, 0)

        @cancellation_fee = (fee * 100).round
      end
    end
  end
end
