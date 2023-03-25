module Shared::Bookings
  class Create < ApplicationService
    include ApplicationService::ModelMethods

    attributes :params
    # TODO: refactor! service should not rely on context if it doesn't include
    # it! generic reusable service should rely on attributes only!
    delegate :user, :company, :reincarnated?, :back_office, to: :context
    delegate :booker_references, to: :references_processor

    attr_reader :booking, :schedule

    def execute!
      return if company.service_suspended?
      return unless form_processor_service.valid?

      transaction do
        create_schedule if recurring?
        result { create_booking }
        create_booker_references if success? && booker_references_submitted?

        if booking.persisted? && booker_references.all?(&:persisted?)
          parse_addresses
          validate_flight_number!
          update_travel_distance
          update_pricing_rule_fare_quote
        end
      end

      if success?
        booking.add_change(:booking_created, 'Booking created')
        request_booking_creation
        faye_notify_creation
        check_flight if booking.flight.present?
        create_additional_bookings if multiple_booking?
        ::Bookings::FutureBookingsNotifier.new(booking: booking).execute
      end
    end

    def show_result
      show_service.execute.result.merge(additional_bookings: additional_bookings)
    end

    private def show_service
      Show.new(booking: result)
    end

    def errors
      form_processor_errors.merge(booking_errors).deep_merge(fligh_validator_service.errors)
    end

    private def form_processor_errors
      return {} unless form_processor_service.executed?

      # :flight is the only booking attribute validated by form processor.
      form_processor_service.result[:errors].slice(:flight)
    end

    private def booking_errors
      return {} if booking.blank?

      booking.errors.merge(references_processor.errors)
    end

    def context
      fail "#{self.class.name} does not implement #{__method__}"
    end

    private def additional_bookings
      @additional_bookings ||= []
    end

    private def form_processor_service
      @form_processor_service ||=
        ::Bookings::FormProcessor.new(
          company: company,
          booking_params: params
        )
    end

    private def create_booking
      # Add corresponding properties that should be cloned
      # to recurring booking to app/services/shared/bookings/clone_recurring.rb
      @booking = Booking.new(
        booker: booker,
        message: params[:message],
        flight: params[:flight],
        room: params[:room],
        vehicle: vehicle,
        scheduled_at: scheduled_at,
        asap: asap?,
        international_flag: params[:international_flag],
        travel_reason: travel_reason,
        quote_id: quote_id,
        passenger_phone: params[:passenger_phone],
        phone_booking: !!reincarnated?,
        payment_method: payment_method,
        payment_card_id: payment_card&.id,
        fare_quote: params[:vehicle_price].presence || 0,
        company_info_id: company.company_info.id,
        source_type: source_type,
        vehicle_vendor: vehicle_vendor
      )

      if user.try(:passenger?) && !back_office
        booking.passenger = user
      elsif params[:passenger_id].present?
        booking.set(passenger: passenger_from_params)
      elsif params[:passenger_name].present?
        first_name, last_name = params[:passenger_name]&.split(/\s+/, 2)
        booking.set(passenger_first_name: first_name, passenger_last_name: last_name)
      end

      if booking.passenger
        booking.vip = booking.passenger.vip?
        booking.ftr = booking.passenger.bookings_dataset.count.zero?
        booking.special_requirements = special_requirements
      else
        booking.ftr = Booking.dataset.where(passenger_phone: params[:passenger_phone]).empty?
      end

      if recurring?
        booking.recurring_next = true
        booking.schedule = schedule
      end

      booking.set(
        params.slice(
          :journey_type,
          :region_id,
          :estimate_id,
          :supplier,
          :supports_flight_number,
          :supports_driver_message
        )
      )

      booking.save
    end

    private def booker
      user
    end

    private def create_schedule
      @schedule = ::Shared::BookingSchedules::Save.new(params: params[:schedule], booking_params: params).execute.result
    end

    private def references_processor
      @references_processor ||= ::Bookings::ReferencesProcessor.new(params: params[:booker_references], booking_id: booking.id)
    end

    private def create_booker_references
      assert { references_processor.execute.success? }
    end

    private def payment_method
      # Enforce 'cash' for affiliate bookings
      company.affiliate? ? 'cash' : params[:payment_method]
    end

    private def payment_card
      return @payment_card if defined? @payment_card

      @payment_card =
        ::Bookings::FetchPaymentCard.new(
          passenger: passenger_from_params,
          payment_card_id: params[:payment_card_id]
        ).execute.result
    end

    private def passenger_from_params
      return if params[:passenger_id].blank?

      @passenger_from_params ||= company.passengers_dataset.with_pk!(params[:passenger_id])
    end

    private def booker_references_submitted?
      booker_references.present?
    end

    private def travel_reason
      return if params[:travel_reason_id].blank?

      company.travel_reasons_dataset.first(id: params[:travel_reason_id].to_i)
    end

    private def quote_id
      params[:quote_id] if vehicle&.allow_quote?
    end

    private def vehicle
      @vehicle ||= ::Vehicle.find(value: params[:vehicle_value])
    end

    private def parse_addresses
      pickup_address = booking.build_booking_address(address_type: 'pickup')
      destination_address = booking.build_booking_address(address_type: 'destination')

      assert { assign_address(pickup_address, params[:pickup_address], join_model: true, &with_passenger_address_type_assignment) }
      assert { assign_address(destination_address, params[:destination_address], join_model: true, &with_passenger_address_type_assignment) }

      Array(params[:stops]).each do |stop|
        stop_point = booking.build_booking_address(
          address_type: 'stop',
          stop_info: stop.slice(:name, :phone, :passenger_id).to_h
        )
        assert { assign_address(stop_point, stop[:address], join_model: true, &with_passenger_address_type_assignment) }
      end
    end

    private def with_passenger_address_type_assignment
      proc do |booking_address|
        passenger = booking.passenger
        next if passenger.blank?

        passenger_address = passenger.passenger_addresses.find{ |pa| pa.address_id == booking_address.address_id }
        booking_address.passenger_address_type = passenger_address&.type
      end
    end

    private def update_travel_distance
      travel_distance = ::Bookings::TravelDistanceCalculator.new(booking: booking).execute.result
      return unless travel_distance

      assert { update_model(booking, travel_distance: travel_distance[:distance]) }
    end

    private def update_pricing_rule_fare_quote
      assert { PricingRules::UpdateBooking.new(booking: booking).execute.success? }
    end

    private def validate_flight_number!
      assert { flight_valid? }
    end

    private def flight_valid?
      fligh_validator_service.execute.success?
    end

    private def fligh_validator_service
      @fligh_validator_service ||= ::Bookings::FlightValidator.new(booking: booking)
    end

    private def request_booking_creation
      metadata = form_processor_service.execute.result[:metadata]

      CreateBookingRequestWorker.perform_async(booking.id, metadata)
    end

    private def faye_notify_creation
      Faye.bookings.notify_create(booking)
    end

    private def multiple_booking?
      params[:vehicle_count].to_i > 1
    end

    private def create_additional_bookings
      additional_bookings_count = params.delete(:vehicle_count).to_i - 1
      additional_bookings_count.times do
        fail_safe(retry: 2) do
          additional_bookings << self.class.new(params: params).execute.show_result
        end
      end
    end

    private def scheduled_at
      if asap? && (vehicle&.ot? || vehicle&.carey?)
        Time.current + 5.minutes
      elsif asap?
        Time.current
      elsif recurring?
        schedule.scheduled_ats.first
      else
        params[:scheduled_at]&.to_time&.utc&.at_beginning_of_minute
      end
    end

    private def source_type
      if params[:source_type].in?(::Booking::SourceType::INTERNAL_TYPES)
        params[:source_type]
      else
        ::Booking::SourceType::API
      end
    end

    private def vehicle_vendor
      return if vehicle.blank?

      vehicle
        .vehicle_vendors_dataset
        .first(active: true, vehicle_vendor_id: params[:vehicle_vendor_id].to_i)
    end

    private def asap?
      params[:scheduled_type] == 'now'
    end

    private def recurring?
      params[:scheduled_type] == 'recurring'
    end

    private def check_flight
      Alerts::FlightChecker.new(booking: booking).execute
    end

    private def special_requirements
      params.fetch(:special_requirements, []).dup.tap do |reqs|
        if !'vip'.in?(reqs) && booking.vip? && vehicle.ot?
          vip_value = company.special_requirements_dataset.where(label: 'vip').get(:key)
          reqs << vip_value if vip_value.present?
        end
      end
    end
  end
end
