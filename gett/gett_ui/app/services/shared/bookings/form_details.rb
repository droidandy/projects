using Sequel::CoreRefinements

module Shared::Bookings
  class FormDetails < ApplicationService
    VEHICLE_ATTRIBUTES = %i[
      name
      value
      price
      quote_id
      region_id
      estimate_id
      supplier
      supports_flight_number
      supports_driver_message
      otp_code
    ].freeze

    attributes :company, :data_params, :booking_params, :allow_personal_cards, :with_manual,
      :include_vehicle_vendor_options

    def execute!
      if request_vehicles?
        result[:vehicles_data] = vehicles_data
        attrs[:vehicle] = first_available_vehicle
      end

      if generate_scheduled_ats? || custom_recurring_schedule?
        result[:unavailable_scheduled_ats] = unavailable_scheduled_ats
      end

      if request_journey_types?
        result[:journey_types] = journey_types_service.execute.result
      end

      # TODO: consider placing this payment-type related logic *before* vehicles request,
      # since possible change in currently selected payment type and method can affect
      # available vehicles. for instance, request may be sent with payment_method == 'account',
      # and vehicles data will be fetched according to this payment_method, but at the end
      # payment method may be switched to passenger payment card, if it's a company's
      # default payment method, and we already have a vehicles data for 'account' method.
      if request_payment_types?
        result[:payment_type_options] = payment_types_service.execute.result
        attrs[:payment_type] = payment_types_service.default_payment_type unless preserve_payment_type?
      end

      result[:special_requirement_options] = special_requirement_options
      attrs[:special_requirements] = booking_params[:special_requirements] & available_special_requirements_keys

      result[:vehicle_vendor_options] = vehicle_vendor_options if include_vehicle_vendor_options?
      attrs[:vehicle_vendor_id] = '' unless available_vehicle_vendor_ids.include?(booking_params[:vehicle_vendor_id].to_i)

      attrs[:scheduled_ats] = available_scheduled_ats

      # TODO: merge updated result[:attrs] to booking_params prior to passing them
      # to form processor for it to use actual values. but at the moment of
      # writing it's logic doesn't depend on anything that might be affected
      form_processor_service ||=
        ::Bookings::FormProcessor.new(
          company: company,
          booking_params: booking_params,
          vehicles_data: result[:vehicles_data] # now we need to process only vehicles_data
        )

      # form processing logic
      result.merge!(form_processor_service.execute.result.slice(:errors, :alerts))

      # TODO: make it possible to merge any processor-updated attributes in a generic way.
      # At the moment of writing only `:journey_type` attribute might change
      attrs[:journey_type] = form_processor_service.result[:booking_params][:journey_type]
    end

    def result
      @result ||= {}
    end

    def attrs
      result[:attrs] ||= {}
    end

    private def vehicles_data
      @vehicles_data ||=
        ::Bookings::Vehicles.new(company: company, params: vehicles_params, with_manual: with_manual?).execute.result
    end

    private def generated_scheduled_ats
      @generated_scheduled_ats ||=
        ::Bookings::ScheduleGenerator.new(params: booking_params[:schedule]).execute.result
    end

    private def journey_types_service
      @journey_types_service ||=
        ::Bookings::FetchJourneyTypes.new(
          company: company,
          passenger: passenger
        )
    end

    private def payment_types_service
      @payment_types_service ||=
        ::Bookings::FetchPaymentTypes.new(
          company: company,
          passenger: passenger,
          vehicle_name: booking_params[:vehicle_name],
          allow_personal_cards: allow_personal_cards?
        )
    end

    private def available_special_requirements_keys
      special_requirement_options.pluck(:key)
    end

    private def special_requirement_options
      return [] if current_vehicle.nil?

      @special_requirement_options ||=
        company.special_requirements_for(current_vehicle.service_type)
    end

    private def vehicle_vendor_options
      return [] unless current_vehicle&.ot?
      return @vehicle_vendor_options if defined?(@vehicle_vendor_options)

      cities = [booking_params.dig(:pickup_address, :city)&.downcase]
      postcode_prefixes = [postcode_prefix(booking_params.dig(:pickup_address, :postal_code))]

      if booking_params[:scheduled_at].present?
        cities << booking_params.dig(:destination_address, :city)&.downcase
        postcode_prefixes << postcode_prefix(booking_params.dig(:destination_address, :postal_code))
      end

      return @vehicle_vendor_options = [] if cities.none? && postcode_prefixes.none?

      @vehicle_vendor_options =
        DB[:vehicle_vendors]
          .join(:vehicle_vendors_vehicles, vehicle_vendor_id: :id)
          .select(:vehicle_vendors[:id], :vehicle_vendors[:name])
          .where(active: true, vehicle_id: current_vehicle[:vehicle_ids].to_a)
          .where{ (city =~ cities) | (Sequel.pg_array(:vehicle_vendors[:postcode_prefixes]).overlaps(postcode_prefixes.pg_array)) }
          .all
    end

    private def postcode_prefix(postcode)
      postcode&.split(' ')&.first
    end

    private def available_vehicle_vendor_ids
      vehicle_vendor_options.pluck(:id)
    end

    private def passenger
      return @passenger if defined?(@passenger)

      @passenger =
        booking_params[:passenger_id].presence && company.members_dataset.with_pk!(booking_params[:passenger_id])
    end

    private def available_scheduled_ats
      return booking_scheduled_ats if custom_recurring_schedule?

      actual_scheduled_ats =
        (generate_scheduled_ats? && !preserve_scheduled_ats?) ? generated_scheduled_ats : booking_scheduled_ats

      available_scheduled_ats = schedule_validator_service.execute.result[:available_scheduled_ats]
      actual_scheduled_ats.select do |actual|
        available_scheduled_ats.any? do |available|
          # here we find a date within a one minute range because `schedule_validator_service` make a rounding
          # to minutes, but `actual_scheduled_ats` is timestamp and has microsecond precision
          (actual.to_i - available.to_i).abs < 60
        end
      end
    end

    private def unavailable_scheduled_ats
      schedule_validator_service.execute.result[:unavailable_scheduled_ats]
    end

    private def schedule_validator_service
      return @schedule_validator_service if defined?(@schedule_validator_service)

      scheduled_ats =
        if generate_scheduled_ats?
          (schedule_params[:starting_at].to_datetime..schedule_params[:ending_at].to_datetime).to_a
        else
          booking_scheduled_ats
        end

      @schedule_validator_service =
        ::Bookings::ScheduleValidator.new(
          scheduled_ats: scheduled_ats,
          vehicle_value: request_vehicles? ? first_available_vehicle[:value] : booking_params[:vehicle_value],
          passenger_id: booking_params[:passenger_id],
          pickup_address: booking_params[:pickup_address],
          destination_address: booking_params[:destination_address]
        )
    end

    private def first_available_vehicle
      return @first_available_vehicle if defined?(@first_available_vehicle)

      available_vehicles = vehicles_data[:vehicles].select{ |v| v[:available] }

      if booking_params[:vehicle_touched]
        vehicle = available_vehicles.find{ |v| v[:name] == booking_params[:vehicle_name] }
      end

      vehicle ||=
        available_vehicles.find{ |v| v[:name] == passenger&.default_vehicle } ||
        available_vehicles.first

      @first_available_vehicle = vehicle&.slice(*VEHICLE_ATTRIBUTES) || {}
    end

    private def current_vehicle
      return @current_vehicle if defined?(@current_vehicle)

      vehicle_value = request_vehicles? ? first_available_vehicle[:value] : booking_params[:vehicle_value]
      @current_vehicle = vehicle_value.presence && Bookings::Vehicle.all.find{ |v| v.values.include?(vehicle_value) }
    end

    private def request_vehicles?
      data_params[:request_vehicles] && scheduled_at_present? && passenger_info_present? && all_stops_valid?
    end

    private def request_journey_types?
      company&.bbc?
    end

    private def request_payment_types?
      data_params[:request_payment_types]
    end

    private def preserve_scheduled_ats?
      data_params[:preserve_scheduled_ats]
    end

    private def preserve_payment_type?
      data_params[:preserve_payment_type]
    end

    private def scheduled_at_present?
      booking_params[:scheduled_type] == 'now' || booking_params[:scheduled_at].present?
    end

    private def passenger_info_present?
      booking_params[:passenger_id].present? || (
        booking_params[:passenger_name].present? && booking_params[:passenger_phone].present?
      )
    end

    private def all_stops_valid?
      valid_address?(booking_params[:pickup_address]) &&
        (booking_params[:as_directed] || valid_address?(booking_params[:destination_address])) &&
        booking_stops.all?{ |stop| valid_address?(stop[:address]) }
    end

    private def booking_stops
      booking_params[:stops] || []
    end

    private def valid_address?(address_params)
      address_params.present? && address_params[:country_code].present?
    end

    private def booking_scheduled_ats
      booking_params.dig(:schedule, :scheduled_ats)&.map(&:to_datetime) || []
    end

    private def generate_scheduled_ats?
      data_params[:request_scheduled_ats] &&
        recurring_schedule_type? && !schedule_params[:custom] &&
        schedule_params[:starting_at].present? && schedule_params[:ending_at].present?
    end

    private def recurring_schedule_type?
      booking_params[:scheduled_type] == 'recurring'
    end

    private def custom_recurring_schedule?
      recurring_schedule_type? && schedule_params[:custom]
    end

    private def schedule_params
      booking_params[:schedule]
    end

    private def vehicles_params
      booking_params.slice(
        :passenger_id,
        :passenger_name,
        :passenger_phone,
        :pickup_address,
        :destination_address,
        :stops,
        :scheduled_type,
        :scheduled_at,
        :payment_card_id,
        :payment_method,
        :as_directed
      )
    end

    private def rule_checker_params
      booking_params.slice(
        :pickup_address,
        :destination_address
      )
    end
  end
end
