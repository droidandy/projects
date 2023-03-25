module BookingUpdaters
  class Base < ApplicationWorker
    INTERVAL = 15.seconds.freeze

    def self.perform_scheduled(*args)
      perform_in(self::INTERVAL, *args)
    end

    def perform(booking_id)
      booking = Booking.fully_created.not_final[booking_id]
      # booking no longer has to be updated
      return if booking.blank?

      updater = Bookings.updater_for(booking)

      return if updater.blank?

      updater.execute

      booking.reload

      return if booking.final? || booking.scheduled_at > BookingsUpdater::UPDATE_TIME_OFFSET.from_now

      # a check here to prevent multiple jobs to be scheduled for the same order. this shouldn't happen
      # if whole logic is done right
      # TODO: check BookingsUpdater and refactor
      set = Sidekiq::ScheduledSet.new
      unless set.any?{ |job| job.klass =~ /BookingUpdaters::(?:OT|Gett|Splyt)/ && job.args[0] == booking_id }
        self.class.perform_scheduled(booking_id)
      end
    end
  end
end
