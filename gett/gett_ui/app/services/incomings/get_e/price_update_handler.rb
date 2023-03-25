module Incomings
  module GetE
    class PriceUpdateHandler < Base
      delegate :company, to: :booking
      delegate :price_with_fx_rate_increase, to: :company

      def execute!
        super do
          booking.update(fare_quote: price)
          BookingsChargesUpdater.perform_async(booking.id)
        end
      end

      private def validate
        errors.add(:booking, :not_found) if booking.blank?
        errors.add(:booking, :no_price) if price.blank?
        errors.add(:booking, :not_completed) if booking.present? && !booking.completed?
      end

      private def price
        payload_price = payload.dig('data', 'Pricing', 'Price', 'Amount')

        return if payload_price.blank? || booking.blank?

        price_with_fx_rate_increase(payload_price.to_f * 100, international: booking.international?)
      end
    end
  end
end
