class NotificationMailer < ApplicationMailer
  def notify_passenger(booking, message)
    @booking = booking
    @user = booking.passenger
    @body = message
    @thank_you = true

    try_to_add_cta_block
    try_to_add_cta_phone_block
    try_to_add_calendar_event if @user.notify_with_calendar_event?

    @booking.add_change(:email, "Passenger - #{@booking.status.humanize}")
    mail to: @user.email, subject: subject
  end

  def notify_booking_booker(booking, message)
    @booking = booking
    @user = booking.booker
    @body = message
    @thank_you = true

    try_to_add_cta_block
    try_to_add_cta_phone_block
    try_to_add_calendar_event

    @booking.add_change(:email, "Booker - #{@booking.status.humanize}")
    mail to: @user.email, subject: subject
  end

  def notify_company_booker(booking, booker_email, message)
    @booking = booking
    @user = company_booker(booker_email)
    @body = message

    try_to_add_extra_footer_block
    try_to_add_calendar_event

    mail to: @user.email, subject: subject
  end

  private def subject
    case @booking.status
    when 'order_received' then "We’ve received your #{@booking.order_id} order"
    when 'on_the_way'     then "Your driver is on the way for #{@booking.order_id}"
    when 'arrived'        then "Your driver is here for #{@booking.order_id}"
    when 'cancelled'      then "Your cancellation for order #{@booking.order_id}"
    else fail("Unable to fetch subject for Booking ##{@booking.id} with status '#{@booking.status}'")
    end
  end

  private def try_to_add_cta_block
    return unless @booking.cancelled?

    @cta_block = true
  end

  private def try_to_add_cta_phone_block
    return unless @booking.order_received?

    @cta_phone_block = true
  end

  private def try_to_add_extra_footer_block
    return unless @booking.company.exactly_enterprise?
    return unless ['order_received', 'on_the_way'].include?(@booking.status)

    @extra_footer_block = :track_your_order
  end

  private def try_to_add_calendar_event
    return unless @booking.future? && @booking.order_received?

    add_calendar_event
  end

  private def add_calendar_event
    event_summary = "Your Gett Business Solutions powered by One Transport #{@booking.order_id} Journey"
    event_description = <<-DESC.squish
      Pick up address: #{@booking.pickup_address.line}.
      #{"Destination address: #{@booking.destination_address.line}." if @booking.destination_address.present?}
      Visit this url for more info on your booking: #{short_link}
      #{"Reason For Travel: #{@booking.travel_reason.name}" if @booking.travel_reason.present?}
    DESC

    cal = Icalendar::Calendar.new

    cal.event do |e|
      e.dtstart = Icalendar::Values::DateTime.new(@booking.scheduled_at.utc, tzid: 'UTC')
      e.dtend = Icalendar::Values::DateTime.new(@booking.scheduled_at.utc + estimated_minutes, tzid: 'UTC')
      e.summary = event_summary
      e.description = event_description
      e.location = @booking.pickup_address.line
      e.ip_class = "PUBLIC"

      e.alarm do |a|
        a.action = "DISPLAY"
        a.trigger = "-PT10M"
        a.summary = event_summary
      end
    end

    attachments['event.ics'] = { mime_type: 'application/ics', content: cal.to_ical }
  end

  private def estimated_minutes
    distance_calculator = Bookings::TravelDistanceCalculator.new(
      pickup: address_geodata(@booking.pickup_address),
      stops: address_geodata(@booking.stop_addresses),
      destination: address_geodata(@booking.destination_address)
    )
    distance_calculator.execute

    if distance_calculator.success?
      distance_calculator.result[:duration].minutes
    else
      30.minutes
    end
  end

  private def address_geodata(address)
    address.as_json(only: [:lat, :lng])
  end

  private def short_link
    ShortUrl.generate("/bookings/#{@booking.id}/summary")
  end

  private def company_booker(booker_email)
    company = @booking.company

    company.bookers_dataset.first(email: booker_email) ||
      Hashie::Mash.new(email: booker_email, full_name: "#{company.name} booker", enterprise?: company.enterprise?)
  end
end
