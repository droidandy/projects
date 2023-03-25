module Passengers
  class Stats < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context

    attributes :passenger

    def self.policy_class
      Passengers::ShowPolicy
    end

    def execute!
      Bookings::MonthlyStats.new(
        dataset: bookings_dataset,
        show_daily_spent: !passenger.company.affiliate?
      ).execute.result
    end

    private def bookings_dataset
      Booking.where(passenger_id: passenger.id).completed
    end
  end
end
