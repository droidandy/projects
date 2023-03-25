class BookingsChargesUpdater < ApplicationWorker
  sidekiq_options queue: :default

  def perform(booking_id)
    @booking = Booking.with_pk!(booking_id)
    api_class.new(booking: @booking).execute
  end

  private def api_class
    "Bookings::ChargesUpdaters::#{api_type}".constantize
  end

  private def api_type
    case @booking.service_type.to_sym
    when :gett then 'Gett'
    when :ot then 'OT'
    when :get_e then 'GetE'
    when :splyt then 'Splyt'
    when :manual then 'Manual'
    when :carey then 'Carey'
    end
  end
end
