class BookingsBeforehandUpdater < BookingsUpdater
  sidekiq_options queue: :default, retry: false

  def perform
    bookings = Booking.fully_created.not_final
      .provided_by(SCHEDULED_SERVICE_TYPES)
      .where{ scheduled_at > UPDATE_TIME_OFFSET.from_now }
      .eager(:vehicle)
      .all

    bookings.each do |b|
      self.class.updater_for(b).perform_async(b.id)
    end
  end
end
