using Sequel::CoreRefinements

class BookingsAlertsChecker < ApplicationWorker
  sidekiq_options queue: :default, retry: false

  def perform
    bookings = Booking.fully_created.not_final.eager(:driver, :alerts).all

    bookings.each do |booking|
      Alerts::BookingsChecker.new(booking: booking).execute
    end

    # This statuses should be removed from finalized and 'processing' bookings
    DB[:alerts].where(type: ['driver_is_late', 'has_no_driver', 'order_changed'])
      .where(booking_id: DB[:bookings].where(status: ['processing', *Booking::FINAL_STATUSES]).select(:id))
      .delete
  end
end
