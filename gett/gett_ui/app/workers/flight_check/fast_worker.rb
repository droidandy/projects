module FlightCheck
  class FastWorker < FlightCheckWorker
    private def bookings_dataset
      super.where{ (scheduled_at <= 8.hours.from_now) & (scheduled_at > Time.current) }
    end
  end
end
