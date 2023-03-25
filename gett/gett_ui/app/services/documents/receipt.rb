class Documents::Receipt < ApplicationService
  include ApplicationService::DocumentRenderer
  include HomePrivacy::AddressHelpers
  include ActionView::Helpers::NumberHelper
  include ApplicationService::TimeHelpers

  attributes :booking_id

  def template_assigns
    {
      booking:                  booking,
      passenger_name:           booking.passenger.first_name.capitalize,
      map_image_url:            GoogleApi::CardReceiptStaticMap.new(booking: booking, size: '300x300', scale: 4).execute.result,
      ride_duration:            interval_to_hms(booking.started_at, booking.ended_at),
      formatted_vehicle_type:   formatted_vehicle_type,
      travel_reason:            booking.travel_reason&.name,
      references:               references,
      waiting_time:             seconds_to_hms(booking.charges&.paid_waiting_time_minutes.to_i * 60),
      pickup_address_line:      safe_address_line(booking.pickup_address),
      destination_address_line: safe_address_line(booking.destination_address),
      stop_address_lines:       booking.stop_addresses.map{ |stop_address| safe_address_line(stop_address) },
      started_at:               timestamp_in_timezone(booking.started_at)&.strftime('%H:%M, %d %B %Y'),
      ended_at:                 timestamp_in_timezone(booking.ended_at)&.strftime('%H:%M, %d %B %Y'),
      total:                    format_cents(booking.successful_payment&.amount_cents),
      fare:                     format_cents(booking.charges&.fare_cost),
      fee:                      format_cents(booking.charges&.all_fees.to_i - booking.charges&.tips.to_i),
      vat:                      format_cents(booking.charges&.vat),
      tips:                     format_cents(booking.charges&.tips)
    }
  end

  def booking
    @booking ||= Booking.with_pk!(booking_id)
  end

  private def references
    refs = booking.booker_references

    return if refs.blank?

    (0..3).map do |i|
      ref = refs[i]
      { name: ref&.booking_reference_name, value: ref&.value }
    end
  end

  private def formatted_vehicle_type
    vehicle_name = booking.vehicle.name
    booking.gett? ? vehicle_name : "OT #{vehicle_name}"
  end

  private def timestamp_in_timezone(tstamp)
    tstamp&.in_time_zone(booking.timezone)
  end

  private def format_cents(cents)
    number_to_currency(cents.to_f / 100, unit: '£ ')
  end
end
