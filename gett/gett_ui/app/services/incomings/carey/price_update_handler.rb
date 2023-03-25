module Incomings
  module Carey
    class PriceUpdateHandler < BaseHandler
      include ApplicationService::CurrencyHelpers

      delegate :company, to: :booking
      delegate :price_with_fx_rate_increase, to: :company

      def execute!
        fail_safe(silence: true, fail_on_error: true) do
          result { update_model(booking, fare_quote: fare_quote) }

          if success?
            create_model(incoming)
            Bookings::ChargesUpdaters::Carey.new(booking: booking).execute
            Faye.bookings.notify_update(booking)
          else
            fail_with_exception!
          end
        end
      end

      private def fare_quote
        price_with_fx_rate_increase(converted_price, international: booking.international?)
      end

      private def converted_price
        convert_currency(amount: payload[:amount].to_f, from: payload[:currencyCode])
      end
    end
  end
end
