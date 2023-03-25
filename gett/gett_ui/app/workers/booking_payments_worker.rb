class BookingPaymentsWorker < ApplicationWorker
  sidekiq_options queue: :default

  def perform(booking_id)
    booking = Booking.with_pk!(booking_id)
    BookingPayments::Create.new(booking: booking).execute
  end
end
