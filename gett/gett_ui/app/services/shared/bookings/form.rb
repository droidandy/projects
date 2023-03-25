class Shared::Bookings::Form < ApplicationService
  include ApplicationService::Context
  include HomePrivacy::AddressHelpers

  attributes :booking, :member, :company, :passengers_dataset, :back_office,
    :allow_personal_cards, :repeating_booking, :reversing_booking, :details_editable_due_status

  def execute!
    return unless booking_eligible?

    {
      travel_reasons: company.travel_reasons_dataset.active.all.as_json(only: [:id, :name]),
      journey_types: journey_types,
      booking_references: booking_references,
      default_pickup_address: (company.default_location&.address || company.address).as_json,
      default_driver_message: company.default_location&.pickup_message || company.default_driver_message || '',
      default_payment_type: company.payment_options.default_payment_type,
      payment_types: company.payment_options.payment_types,
      payment_type_options: payment_type_options,
      service_suspended: company.service_suspended?,
      locations: locations_data,
      company_type: company.company_type
    }.tap do |data|
      data[:booking] = booking_data if booking.present?
    end
  end

  def can_change_details?
    new_booking? || details_editable_due_status?
  end

  def can_change_vehicle_count?
    can_change_details? && company.multiple_booking?
  end

  def passengers_data
    passengers_dataset
      .active
      .by_name
      .eager(:home_address, :work_address, :payment_cards, favorite_addresses: :address)
      .all
      .map(&method(:passenger_data))
  end

  def passenger_data(passenger)
    member_is_a_passenger = member&.id == passenger.id

    passenger.as_json(
      only: %i(
        id first_name last_name phone mobile default_vehicle cost_centre
        avatar_url avatar_versions default_phone_type
      )
    ).merge!(
      'home_address' => safe_address_as_json(passenger.home_address, skip_sanitize: member_is_a_passenger),
      'work_address' => passenger.work_address.as_json,
      'favorite_addresses' => passenger.favorite_addresses.as_json(
        only: [:id, :name, :passenger_id, :pickup_message, :destination_message],
        include: [:address]
      ),
      'preferred_vendor_allowed' => preferred_vendor_allowed_for(passenger),
      # TODO: wipe out since available payment types are fetched on server side
      'payment_cards' => payment_cards_data(passenger)
    )
  end

  private def preferred_vendor_allowed_for(passenger)
    company.allow_preferred_vendor? && passenger.allow_preferred_vendor? && passenger.vip?
  end

  private def journey_types
    ::Bookings::FetchJourneyTypes.new(
      company: company,
      passenger: booking&.passenger || (new_booking?.presence && member)
    ).execute.result
  end

  private def payment_type_options
    ::Bookings::FetchPaymentTypes.new(
      company: company,
      passenger: booking&.passenger || (new_booking?.presence && member),
      allow_personal_cards: allow_personal_cards?
    ).execute.result
  end

  private def new_booking?
    booking.nil? || repeating_booking?
  end

  private def booking_eligible?
    return booking.final? if repeating_booking?
    return true if reversing_booking?

    booking.nil? || booking_editable?
  end

  private def booking_editable?
    back_office? ? booking.editable_in_back_office? : booking.editable?
  end

  private def payment_cards_data(passenger)
    passenger.payment_cards
      .select do |card|
        allow_personal_cards? || member.id == passenger.id ||
          card.business? || passenger.allow_personal_card_usage?
      end
      .reject(&:expired?)
      .as_json(only: [:id, :default], include: [:type, :title])
  end

  private def booking_references
    ::Bookings::References.new(booking_id: booking&.id).execute.result
  end

  private def booking_data
    if reversing_booking?
      booking_data_reversing
    elsif repeating_booking?
      booking_data_repeating
    else
      booking_data_regular
    end
  end

  private def booking_data_repeating
    booking_data_regular.symbolize_keys.slice(
      :passenger_id,
      :service_type,
      :passenger_name,
      :international_flag,
      :passenger_phone,
      :stops,
      :vehicle_value,
      :vehicle_name,
      :vehicle_vendor_id,
      :pickup_address,
      :destination_address,
      :message,
      :flight,
      :travel_reason_id,
      :payment_type,
      :booker_id
    ).merge(
      scheduled_type: 'now',
      as_directed: booking.as_directed?
    )
  end

  private def booking_data_reversing
    booking_data_repeating.tap do |data|
      point = data[:pickup_address]
      data[:pickup_address] = data[:destination_address]
      data[:destination_address] = point
      data[:stops] = data[:stops].reverse
    end
  end

  private def booking_data_regular
    member_is_a_passenger = member&.id == booking.passenger_id

    booking.as_json(
      only: [
        :id,
        :message,
        :flight,
        :international_flag,
        :status,
        :passenger_id,
        :booker_id,
        :scheduled_at,
        :travel_reason_id,
        :payment_card_id,
        :special_requirements,
        :vehicle_vendor_id
      ],
      include: [:service_type, :message_to_driver]
    ).merge(
      passenger_name: booking.passenger_info[:full_name],
      passenger_phone: booking.passenger_info[:phone_number],
      payment_type: payment_type,
      payment_method: booking.payment_method,
      pickup_address: safe_address_as_json(
        booking.pickup_address,
        skip_sanitize: member_is_a_passenger,
        only: [:id, :line, :lat, :lng, :city, :region, :postal_code, :country_code, :timezone]
      ),
      destination_address: safe_address_as_json(
        booking.destination_address,
        skip_sanitize: member_is_a_passenger,
        only: [:id, :line, :lat, :lng, :city, :region, :postal_code, :country_code, :timezone]
      ),
      stops: stop_addresses,
      scheduled_type: scheduled_type,
      vehicle_value: booking.vehicle.value,
      vehicle_name: booking.vehicle.name,
      schedule: schedule_json
    )
  end

  private def schedule_json
    booking.schedule.as_json(except: [:id, :created_at, :updated_at])
  end

  private def scheduled_type
    return 'now'.freeze if booking.asap?
    return 'recurring'.freeze if booking.recurring_next?

    'later'.freeze
  end

  private def stop_addresses
    booking.stop_addresses.map do |address|
      {address: address.as_json(only: [:line, :lat, :lng, :city, :region, :postal_code, :country_code, :timezone])}
        .merge(address[:stop_info])
    end
  end

  private def locations_data
    company.locations_dataset.order(:name).eager(:address).all.map do |location|
      ::Locations::Show.new(location: location).execute.result
    end
  end

  private def payment_type
    card = booking.payment_card

    return "#{card.type}_payment_card:#{card.id}" if card&.active?

    return booking.payment_method if company.payment_types.include?(booking.payment_method) && card.blank?

    company.payment_options.default_payment_type
  end
end
