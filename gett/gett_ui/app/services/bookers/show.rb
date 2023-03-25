module Bookers
  class Show < ApplicationService
    include ApplicationService::Context
    include ApplicationService::Policy

    attributes :booker

    def execute!
      {record: record, stats: stats}
    end

    private def record
      Bookers::AsJson.new(booker: booker, as: :record).execute.result
    end

    private def stats
      Bookings::MonthlyStats.new(
        dataset: bookings_dataset,
        show_daily_spent: !booker.company.affiliate?
      ).execute.result
    end

    private def bookings_dataset
      Booking.where(booker_id: booker.id).completed
    end
  end
end
