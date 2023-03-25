class FlightCheckWorker < ApplicationWorker
  def perform
    bookings_dataset.all.each do |booking|
      Alerts::FlightChecker.new(booking: booking).execute
    end
  end

  private def bookings_dataset
    Booking.not_final.scheduled.with_flight.eager(:alerts, passenger: :user_devices)
  end
end
