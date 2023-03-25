module Admin
  module Members
    class Stats < ApplicationService
      include ApplicationService::Policy
      include ApplicationService::Context

      attributes :member

      def self.policy_class
        Admin::Policy
      end

      def execute!
        ::Bookings::MonthlyStats.new(
          dataset: bookings_dataset,
          show_daily_spent: !member.company.affiliate?
        ).execute.result
      end

      private def bookings_dataset
        Booking.where(passenger_id: member.id).completed
      end
    end
  end
end
