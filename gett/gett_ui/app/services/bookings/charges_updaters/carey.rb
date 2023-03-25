module Bookings
  module ChargesUpdaters
    class Carey < IntegratedBase
      private def cancellation_before_arrival_fee
        company_info.carey_cancellation_before_arrival_fee
      end

      private def cancellation_after_arrival_fee
        company_info.carey_cancellation_after_arrival_fee
      end
    end
  end
end
