module FlightCheck
  class SlowWorker < FlightCheckWorker
    private def bookings_dataset
      super
        .where do
          (scheduled_at <= 24.hours.from_now && scheduled_at > 8.hours.from_now) |
            (scheduled_at < Time.current)
        end
    end
  end
end
