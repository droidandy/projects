module Shared::Bookings
  class CloneRecurring < ApplicationService
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    attributes :booking

    delegate :schedule, to: :booking

    def execute!
      return if booking.company.service_suspended? || next_scheduled_at.blank?

      transaction do
        result { save_model(next_booking, scheduled_at: next_scheduled_at, recurring_next: true) }

        if next_booking.persisted?
          clone_booker_references
          clone_addresses
          next_booking.add_change(:booking_created, 'New recurring booking created')
        end
      end

      CreateBookingRequestWorker.perform_async(next_booking.id) if success?
    end

    def next_booking
      @next_booking ||= Booking.new(booking.values.slice(
        :booker_id,
        :message,
        :flight,
        :vehicle_id,
        :travel_distance,
        :international_flag,
        :travel_reason,
        :quote_id,
        :passenger_id,
        :passenger_first_name,
        :passenger_last_name,
        :passenger_phone,
        :phone_booking,
        :payment_method,
        :payment_card_id,
        :fare_quote,
        :company_info_id,
        :source_type,
        :asap,
        :vip,
        :ftr,
        :schedule_id
      ))
    end

    private def next_scheduled_at
      schedule.scheduled_ats.find{ |ts| ts >= booking.scheduled_at.tomorrow.at_beginning_of_day }
    end

    private def clone_booker_references
      booking.booker_references.each do |br|
        assert do
          BookerReference.create(
            booking: next_booking,
            value: br.value,
            booking_reference_name: br.booking_reference_name
          )
        end
      end
    end

    private def clone_addresses
      booking.booking_addresses.each do |ba|
        assert do
          BookingAddress.create(
            booking: next_booking,
            address_id: ba.address_id,
            address_type: ba.address_type,
            stop_info: ba.stop_info
          )
        end
      end
    end
  end
end
