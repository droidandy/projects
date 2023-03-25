module Incomings
  module Splyt
    class ReceiptHandler < Base
      delegate :company, to: :booking
      delegate :price_with_fx_rate_increase, to: :company

      private def execute!
        super do
          booking.update(fare_quote: fare_quote) unless booking.cancelled?

          service = Bookings::ChargesUpdaters::Splyt.new(booking: booking)

          unless service.execute.success?
            set_errors(service.errors)
          end
        end
      end

      private def fare_quote
        price_with_fx_rate_increase(order_cost, international: booking.international?)
      end

      private def order_cost
        ::Splyt::Receipt.new(booking: booking).execute.normalized_response[:amount]
      end

      private def validate
        errors.add(:booking, :not_found) if booking.blank?
      end
    end
  end
end
