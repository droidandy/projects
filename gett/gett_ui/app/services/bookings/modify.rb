module Bookings
  class Modify < ApplicationService
    include ApplicationService::Context
    include ApplicationService::ModelMethods
    include Notificator::Concern

    NOTIFY_BOOKING_LESS_THAN = 3.hours
    NOTIFIABLE_STATUSES = ['order_received', 'locating', 'on_the_way', 'arrived'].freeze
    private_constant :NOTIFY_BOOKING_LESS_THAN

    attributes :booking, :params
    delegate :member, :company, :reincarnated?, to: :context
    delegate :errors, to: :booking
    delegate :price_with_fx_rate_increase, to: :company

    def execute!
      unless booking_modifiable?
        set_errors('Booking can no longer be modified')
        return
      end

      notify_on_update do
        transaction do
          booking.lock!
          result { update_booking }
          update_schedule if booking.recurring_next?
          parse_addresses
          check_flight if booking.flight != @old_booking.flight
          update_travel_distance
          update_pricing_rule_fare_quote
          # TODO: need to refactor to be able to commit transaction and free connection as
          # soon as possible, without waiting for API response (which can take several
          # seconds in case of OT API)
          if success?
            assert do
              booking.customer_care? ? resend_booking : request_booking
            end
            notify_by_alert
            log_order_id_change if booking.order_id != @old_booking.order_id
          end
        end
        # finishing transaction here to commit changes after successfully requesting
        # new booking from service provider
        fail_safe(retry: 2, silence: true) { cancel_old_booking } if success? && !same_service_type?
      end
    end

    def errors
      @errors || booking.errors
    end

    def show_result
      Bookings::Show.new(booking: result).execute.result
    end

    private def check_flight
      Alerts::FlightChecker.new(booking: booking).execute
    end

    private def update_booking
      @old_booking = OldBooking.new(
        booking.service_type,
        booking.pickup_address,
        booking.ot_confirmation_number,
        booking.service_id,
        booking.order_id,
        booking.flight
      )

      booking.set(
        params.slice(
          :message,
          :flight,
          :international_flag,
          :payment_method,
          :special_requirements,
          :vehicle_vendor_id,
          :journey_type,
          :region_id,
          :estimate_id,
          :supplier,
          :supports_flight_number,
          :supports_driver_message,
          :message_from_supplier,
          :otp_code,
          :passenger_phone
        )
      )

      # ignore any vehicle and if vehicle has passed 'order_received' state
      if booking.order_received?
        booking.set(vehicle: vehicle, fare_quote: params[:vehicle_price].presence || 0)
      end

      assign_payment_card
      set_scheduled_at

      booking.booked_at = Time.current if vehicle.present? && vehicle.service_type != @old_booking.service_type
      booking.quote_id = params[:quote_id] if vehicle&.allow_quote?
      booking.booker_id = params[:booker_id] if params[:booker_id].present?

      booking.save
    end

    private def update_schedule
      ::Shared::BookingSchedules::Save.new(
        schedule: booking.schedule,
        params: params[:schedule],
        booking_params: params
      ).execute
    end

    private def set_scheduled_at
      return unless params[:scheduled_at]
      return if !booking.order_received? && !booking.customer_care?

      scheduled_at =
        if booking.customer_care? && (booking.asap? || params[:scheduled_at].to_time.past?)
          Time.current
        else
          params[:scheduled_at].to_time.utc.at_beginning_of_minute
        end

      booking.set(scheduled_at: scheduled_at)
    end

    private def assign_payment_card
      if booking.payment_method.in?(Booking::CREDIT_PAYMENTS)
        service = FetchPaymentCard.new(passenger: booking.passenger, payment_card_id: params[:payment_card_id])
        booking.payment_card = service.execute.result
      else
        booking.payment_card = nil
      end
    end

    private def vehicle
      @vehicle ||= ::Vehicle.find(value: params[:vehicle_value])
    end

    private def parse_addresses
      pickup_address = booking.booking_addresses.find{ |ba| ba.address_type == 'pickup' }
      destination_address = booking.booking_addresses.find{ |ba| ba.address_type == 'destination' }

      assert { assign_address(pickup_address, params[:pickup_address], join_model: true, &with_passenger_address_type_assignment) }
      unless booking.as_directed?
        assert { assign_address(destination_address, params[:destination_address], join_model: true, &with_passenger_address_type_assignment) }
      end

      booking.booking_addresses_dataset.where(address_type: 'stop').delete
      Array(params[:stops]).each do |stop|
        stop_point = booking.build_booking_address(
          address_type: 'stop',
          stop_info: stop.slice(:name, :phone, :passenger_id).to_h
        )
        assert { assign_address(stop_point, stop[:address], join_model: true, &with_passenger_address_type_assignment) }
      end

      # clear associations to have them reloaded since join records models might be updated
      booking.associations.except!(:pickup_address, :destination_address, :stop_addresses, :booking_addresses) if success?
    end

    # TODO: DRY with Bookings::Create#with_passenger_address_type_assignment
    private def with_passenger_address_type_assignment
      proc do |booking_address|
        passenger = booking.passenger
        next if passenger.blank?

        passenger_address = passenger.passenger_addresses.find{ |pa| pa.address_id == booking_address.address_id }
        booking_address.passenger_address_type = passenger_address&.type
      end
    end

    private def update_travel_distance
      travel_distance = TravelDistanceCalculator.new(booking: booking).execute.result
      return if travel_distance.blank?

      assert { update_model(booking, travel_distance: travel_distance[:distance]) }
    end

    private def update_pricing_rule_fare_quote
      assert { PricingRules::UpdateBooking.new(booking: booking).execute.success? }
    end

    private def request_booking
      api_service.execute do |on|
        request = Request.new(
          service_provider: booking.service_type,
          subject_gid: booking.to_gid.to_s
        )

        on.request do |url, params|
          create_model(request, url: url, request_payload: params, status: :sent)
        end

        on.success do
          update_model(request, response_payload: update_params, status: :processed)
          update_model(booking, update_params)
        end

        on.failure do
          fail ServiceProviderError, "Cannot #{same_service_type? ? 'modify' : 'create'} booking via #{api_service.class.parent} API"
        end
      end
    end

    private def resend_booking
      Admin::Bookings::ResendOrder.new(booking: booking).execute
    end

    private def api_service
      @api_service ||= Bookings.service_for(booking, same_service_type? ? :modify : :create)
    end

    private def same_service_type?
      return @same_service_type if defined?(@same_service_type)

      @same_service_type = @old_booking.service_type == booking.service_type
    end

    private def cancel_old_booking
      fail_safe { Bookings.service_for(@old_booking, :cancel).execute }
    end

    private def notify_by_alert
      return unless NOTIFIABLE_STATUSES.include?(booking.status)

      if booking.scheduled_at < NOTIFY_BOOKING_LESS_THAN.from_now
        Alerts::Create.new(booking: booking, type: :order_changed).execute
      end
    end

    private def log_order_id_change
      booking.create_version(Sequel::Audited::UPDATE,
        values: { order_id: [@old_booking.order_id, booking.order_id] }
      )
    end

    private def booking_modifiable?
      reincarnated? ? booking.editable_in_back_office? : booking.editable?
    end

    private def update_params
      api_service.normalized_response.tap do |json|
        if json[:fare_quote].present?
          json[:fare_quote] = price_with_fx_rate_increase(json[:fare_quote], international: booking.international?)
        end
      end
    end
  end

  OldBooking = Struct.new(:service_type, :pickup_address, :ot_confirmation_number, :service_id, :order_id, :flight)
end
