class CreateBookingRequestWorker < ApplicationWorker
  sidekiq_options queue: :default, retry: 3

  sidekiq_retry_in { 20 }

  def perform(booking_id, metadata = nil)
    booking = Booking.with_pk!(booking_id)

    ApplicationService::Context.with_context(company: booking.company) do
      Bookings::CreateRequest.new(booking: booking, metadata: metadata).execute
    end
  end

  sidekiq_retries_exhausted do |msg|
    booking_id = msg['args'][0]
    booking = Booking.with_pk!(booking_id)
    Bookings::ToCustomerCare.new(booking: booking, message: msg.to_s).execute
    Alerts::Create.new(booking: booking, type: :api_failure).execute
  end
end
