module Bookings
  module ChargesUpdaters
    class GetE < IntegratedBase
      private def cancellation_before_arrival_fee
        company_info.get_e_cancellation_before_arrival_fee
      end

      private def cancellation_after_arrival_fee
        company_info.get_e_cancellation_after_arrival_fee
      end
    end
  end
end
