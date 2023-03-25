class SpawnRecurringBooking < ApplicationWorker
  sidekiq_options queue: :default, retry: false

  def perform(booking_id)
    booking = Booking.with_pk!(booking_id)

    Shared::Bookings::CloneRecurring.new(booking: booking).execute
  end
end
