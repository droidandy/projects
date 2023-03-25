FactoryGirl.define do
  factory :booking_base, class: 'Booking' do
    asap           true
    ftr            false
    vip            false
    critical_flag  false
    scheduled_at   { Time.current }
    message        'Some message'
    vehicle        { create(:vehicle, :gett, earliest_available_in: 0) }
    status         :order_received
    service_id     'service-id'
    payment_method :account
    travel_distance 10.0
    billed          false
    cancellation_fee false

    transient do
      company                            nil
      timezone                           nil
      pickup_address                     nil
      destination_address                nil
      stop_addresses                     []
      fare_cost                          nil
      total_cost                         nil
      paid_waiting_time_fee              nil
      pickup_passenger_address_type      nil
      destination_passenger_address_type nil
      passenger_phone                    nil
      charges_cancellation_fee           0
      charges_handling_fee               0
      charges_booking_fee                0
      charges_phone_booking_fee          0
      charges_tips                       0
    end

    trait :creating do
      status :creating
    end

    trait :order_received do
      status :order_received
    end

    trait :cancelled do
      status :cancelled
    end

    trait :locating do
      status :locating
    end

    trait :on_the_way do
      status :on_the_way
    end

    trait :arrived do
      status :arrived
    end

    trait :in_progress do
      status :in_progress
    end

    trait :completed do
      status :completed
    end

    trait :rejected do
      status :rejected
    end

    trait :customer_care do
      status :customer_care
    end

    trait :asap do
      asap true
    end

    trait :future do
      asap false
    end

    trait :billed do
      billed true
    end

    trait :with_flight do
      flight 'EK 530'
    end

    trait :account do
      payment_method :account
    end

    trait :cash do
      payment_method :cash
    end

    trait :reincarnated do
      phone_booking true
    end

    trait :critical do
      critical_flag true
    end
  end

  factory :booking, parent: :booking_base do
    after :build do |booking, factory|
      unless factory.__override_names__.include?(:booker)
        company = factory.company || create(:company)
        booking.booker = create(:booker, company: company)
      end

      unless factory.__override_names__.include?(:passenger) || booking.passenger_phone.present? || booking.booker.try(:company)&.affiliate?
        booking.passenger = create(:passenger, company: booking.booker.try(:company) || factory.company || create(:company))
      end

      if booking.booker.try(:company)&.bbc?
        booking.journey_type ||= 'work_to_work'
      end

      if booking.booker.try(:company)&.affiliate?
        booking.passenger_first_name = Faker::Name.first_name
        booking.passenger_last_name = Faker::Name.last_name
        booking.passenger_phone = '+12345678900'
      end

      booking.passenger_phone = factory.passenger_phone || booking.passenger&.phone || '+077077077077'
    end

    after :create do |booking, factory|
      pickup_address = factory.pickup_address || create(:address, timezone: factory.timezone)
      booking.add_booking_address(address_id: pickup_address.id, address_type: 'pickup', passenger_address_type: factory.pickup_passenger_address_type)
      if factory.destination_address != false
        booking.add_booking_address(
          address_id: (factory.destination_address || create(:address)).id,
          address_type: 'destination',
          passenger_address_type: factory.destination_passenger_address_type
        )
      end

      factory.stop_addresses.each do |address|
        booking.add_booking_address(address_id: address.id, address_type: 'stop', stop_info: {stop: 'info'})
      end

      if factory.fare_cost.present? || factory.total_cost.present? || factory.paid_waiting_time_fee.present? || booking.cancellation_fee?
        create(:booking_charges,
          booking:               booking,
          fare_cost:             factory.fare_cost.to_i,
          total_cost:            factory.total_cost.to_i,
          paid_waiting_time_fee: factory.paid_waiting_time_fee.to_i,
          cancellation_fee:      factory.charges_cancellation_fee.to_i,
          handling_fee:          factory.charges_handling_fee,
          booking_fee:           factory.charges_booking_fee,
          phone_booking_fee:     factory.charges_phone_booking_fee,
          tips:                  factory.charges_tips
        )
      end
    end

    trait :scheduled do
      asap false
      scheduled_at { Time.current.tomorrow }
    end

    trait :personal_card do
      payment_method :personal_payment_card
      payment_card { create(:payment_card) }
    end

    trait :business_card do
      payment_method :business_payment_card
      payment_card { create(:payment_card) }
    end

    trait :without_passenger do
      passenger nil
      passenger_first_name { Faker::Name.first_name }
      passenger_last_name { Faker::Name.last_name }
      passenger_phone { '+12345678900' }
    end

    trait :gett do
      # for usage consistency
      vehicle { create(:vehicle, :gett) }
    end

    trait :ot do
      vehicle { create(:vehicle, :one_transport) }
    end

    trait :get_e do
      vehicle { create(:vehicle, :get_e) }
    end

    trait :carey do
      vehicle { create(:vehicle, :carey) }
    end

    trait :international do
      international_flag true
    end

    trait :manual do
      vehicle { create(:vehicle, :manual) }
    end

    trait :carey do
      vehicle { create(:vehicle, :carey) }
    end

    trait :splyt do
      supplier_service_id 'splyt_supplier'
      message_from_supplier { 'message from splyt supplier' }
      otp_code    { '1234' }
      region_id   { 'qwe123' }
      estimate_id { 'qwe123ewq' }
      vehicle     { create(:vehicle, :splyt) }
    end

    trait :payment_by_card do
      payment_method :business_payment_card
    end

    trait :payment_by_personal_card do
      payment_method :personal_payment_card
    end

    trait :with_driver do
      after :create do |record|
        create(:booking_driver, booking: record)
      end
    end

    trait :recurring do
      asap false
      recurring_next true
      schedule { create(:booking_schedule, :custom) }
      scheduled_at { schedule.scheduled_ats.first }
    end
  end

  feature_factory :booking, parent: :booking_base do
    message    ''
    vehicle    { Vehicle.gett.first(name: 'BlackTaxi') }
    status     :creating
    service_id nil
    fare_quote 1900
    passenger  nil
    booker     nil

    transient do
      international false
      driver_rating nil
      service_rating nil
      vehicle_name nil
      as_directed false
    end

    trait :scheduled do
      asap false
      scheduled_at { 2.hours.from_now }
    end

    trait :personal_card do
      payment_method :personal_payment_card
      payment_card { passenger.payment_cards.find(&:personal?) }
    end

    trait :business_card do
      payment_method :business_payment_card
      payment_card { passenger.payment_cards.find(&:business?) }
    end

    trait :company_payment_card do
      payment_method :company_payment_card
    end

    trait :without_passenger do
      passenger nil
      passenger_first_name { Faker::Name.first_name }
      passenger_last_name { Faker::Name.last_name }
      passenger_phone { Faker::PhoneNumber.phone_number(:gb) }
    end

    trait :gett do
      vehicle { Vehicle.gett.first(name: 'BlackTaxi') }
    end

    trait :ot do
      vehicle { Vehicle.ot.first(name: 'Standard') }
    end

    trait :get_e do
      vehicle { Vehicle.get_e.first(name: 'Standard') }
    end

    trait :carey do
      vehicle { Vehicle.carey.first }
    end

    trait :manual do
      vehicle { Vehicle.manual.first }
    end

    trait :with_charges do
      after :create do |record, factory|
        create(:booking_charges, booking: record, total_cost: record.fare_quote, paid_waiting_time_fee: factory.paid_waiting_time_fee.to_i)
      end
    end

    trait :with_alert do
      after :create do |record|
        create(:alert, booking: record)
      end
    end

    before :create do |booking, factory|
      company = factory.company || booking.passenger&.company || booking.booker&.company
      booking.service_id = Faker::Number.number(10) unless booking.status == 'creating'

      booking.payment_method = :cash if company.affiliate?

      booking.booker = booking.passenger if booking.booker.nil?

      if booking.passenger
        booking.vip = booking.passenger.vip
        booking.ftr = booking.passenger.bookings_dataset.count.zero?
      else
        booking.ftr = Booking.dataset.where(passenger_phone: booking.passenger_phone).empty?
      end

      if factory.international
        booking.vehicle = Vehicle.get_e.first(name: 'Standard')
        booking.international_flag = true
      elsif factory.vehicle_name
        booking.vehicle = Vehicle.by_type(booking.service_type).first(name: factory.vehicle_name)
      end

      booking.passenger_phone = factory.passenger_phone || booking.passenger&.phone || '+077077077077'

      if booking.booker.try(:company)&.bbc?
        booking.journey_type ||= 'work_to_work'
      end
    end

    after :create do |booking, factory|
      def default_destination_address
        Address.find_or_create(
          line: '221B Baker St, Marylebone, London NW1 6XE, UK',
          lat: '51.5237102',
          lng: '-0.1584593',
          postal_code: 'NW1 6XE',
          country_code: 'GB',
          city: 'London'
        )
      end

      def default_international_address
        Address.find_or_create(
          line: '123 Devis Déménagement, 207 Rue Turenne, 33000 Bordeaux, France',
          lat: '44.848672',
          lng: '-0.591322',
          postal_code: '33000',
          country_code: 'FR',
          city: 'Bordeaux'
        )
      end

      booking.add_booking_address(
        address_id: (factory.international ? default_international_address : factory.pickup_address || booking.company.address).id,
        address_type: 'pickup',
        passenger_address_type: factory.pickup_passenger_address_type
      )

      unless factory.as_directed
        booking.add_booking_address(
          address_id: (factory.destination_address || default_destination_address).id,
          address_type: 'destination',
          passenger_address_type: factory.destination_passenger_address_type
        )
      end

      if %w(on_the_way arrived in_progress completed).include?(booking.status)
        rating = booking.company.enterprise? ? factory.driver_rating : nil
        create(:booking_driver, booking: booking, trip_rating: rating)
      end

      if booking.completed? && factory.service_rating
        create :feedback, booking: booking, user: booking.booker, rating: factory.service_rating, message: 'Yahoo!'
      end
    end
  end
end
