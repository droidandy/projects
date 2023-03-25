class BookingsPreview < ActionMailer::Preview
  def notify_passenger_order_received
    with_booking(fetch_booking_attributes) do |booking|
      message = Bookings::NotifyPassenger::Message.new(booking: booking, delivered_at: nil)
      NotificationMailer.notify_passenger(booking, message.email)
    end
  end

  def notify_booker_order_received
    with_booking(fetch_booking_attributes) do |booking|
      message = Bookings::NotifyPassenger::Message.new(booking: booking, delivered_at: nil)
      NotificationMailer.notify_booking_booker(booking, message.email)
    end
  end

  private def with_booking(attributes)
    booking = Booking.create(attributes)
    yield booking
  ensure
    # a small delay for Sidekiq to pick up valid data before booking gets
    # destroyed. it happens in thread in order to flush mail sending to Sidekiq,
    # so the code in this thread is executed in "background".
    Thread.new do
      BM.sleep(0.5)
      booking.destroy
    end
  end

  private def fetch_booking_attributes
    company = Company[1] # seeded in development

    {
      service_id: 'ORDR-RCVD',
      status: 'order_received',
      vehicle: Vehicle.all.sample,
      fare_quote: Faker::Number.number(4),
      booker: company.bookers.sample,
      passenger: company.passengers.sample,
      message: Faker::Lorem.sentence,
      payment_method: 'account',
      asap: true,
      scheduled_at: Time.current,
      booked_at: Time.current,
      company_info_id: 1,
      passenger_phone: '+13127223688'
    }
  end
end
