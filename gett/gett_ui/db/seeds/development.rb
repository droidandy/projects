require 'faker/formatted_phone_number'

Seeds.seed(User, :email, [
  email:                 'admin@fakemail.com',
  password:              '123123123',
  password_confirmation: '123123123',
  first_name:            'Admin',
  last_name:             'Super',
  user_role_id:          Role[:superadmin].id
])

ddi = Seeds.seed(Ddi, :type, [
  type: 'key',
  phone: '+442036089312'
]).result[0]

company = Seeds.seed(Company, :id, [
  id: 1,
  gett_business_id: 'UK-3836',
  ot_username: 'Demo_admin',
  ot_client_number: 'D25',
  ddi: ddi
]).result[0]

DB.run("SELECT setval('companies_id_seq', (SELECT MAX(id) FROM companies))")

address_1 = Address.lookup_valid!(
  line: "23 Liverpool St, London EC2M, UK",
  lat: 51.517297,
  lng: -0.0823724,
  country_code: "GB",
  postal_code: "EC2M",
  city: "London"
)

address_2 = Address.lookup_valid!(
  line: "339 Euston Rd, Kings Cross, London NW1 3AD, UK",
  lat: 51.5242536,
  lng: -0.1403077,
  country_code: "GB",
  postal_code: "NW1 3AD",
  city: "London"
)

Seeds.seed(CompanyInfo, :company_id, [
  company_id:   1,
  country_code: "GB",
  name:         'Company 1',
  booking_fee:  1.5,
  run_in_fee:   1,
  handling_fee: 20,
  tips:         10,
  address_id:   address_1.id,
  phone_booking_fee: 0,
  international_booking_fee: 0,
  system_fx_rate_increase_percentage: 0,
  quote_price_increase_pounds:     0,
  quote_price_increase_percentage: 0,
  cancellation_before_arrival_fee:       0,
  cancellation_after_arrival_fee:        0,
  gett_cancellation_before_arrival_fee:  0,
  gett_cancellation_after_arrival_fee:   0,
  get_e_cancellation_before_arrival_fee: 0,
  get_e_cancellation_after_arrival_fee:  0,
  splyt_cancellation_before_arrival_fee: 0,
  splyt_cancellation_after_arrival_fee:  0,
  carey_cancellation_before_arrival_fee: 0,
  carey_cancellation_after_arrival_fee:  0
])

Seeds.seed(PaymentOptions, :company_id, [
  company_id:    company.id,
  payment_types: ['account'],
  default_payment_type: 'account',
  invoicing_schedule: 'monthly',
  payment_terms: 30
])

Seeds.seed(Member, :email, [
  company_id: company.id,
  email:      'companyadmin@fakemail.com',
  password:   '123123123',
  password_confirmation: '123123123',
  first_name: Faker::Name.first_name,
  last_name:  Faker::Name.last_name,
  phone:      Faker::PhoneNumber.phone_number(:gb),
  role:       Role[:companyadmin]
])

bookers = Seeds.seed(Member, :email, 1..30) do |i|
  { company_id: company.id,
    email:      "booker#{i}@fakemail.com",
    password:   '123123123',
    password_confirmation: '123123123',
    first_name: Faker::Name.first_name,
    last_name:  Faker::Name.last_name,
    phone:      Faker::PhoneNumber.phone_number(:gb),
    role:       Role[:booker]
  }
end

Seeds.seed_once(Member, :email, [
  { company_id: company.id,
    email:      'finance1@fakemail.com',
    password:   '123123123',
    password_confirmation: '123123123',
    first_name: Faker::Name.first_name,
    last_name:  Faker::Name.last_name,
    phone:      Faker::PhoneNumber.phone_number(:gb),
    role:       Role[:finance]
  }, {
    company_id: company.id,
    email:      'reset_password@fakemail.com',
    password:   '123123123',
    password_confirmation: '123123123',
    first_name: Faker::Name.first_name,
    last_name:  Faker::Name.last_name,
    phone:      Faker::PhoneNumber.phone_number(:gb),
    role:       Role[:passenger]
  }, {
    company_id: company.id,
    email:      'invitation@fakemail.com',
    password:   '123123123',
    password_confirmation: '123123123',
    first_name: Faker::Name.first_name,
    last_name:  Faker::Name.last_name,
    phone:      Faker::PhoneNumber.phone_number(:gb),
    role:       Role[:passenger]
  }
])

passengers = Seeds.seed(Member, :email, 1..30) do |i|
  { company_id: company.id,
    email:      "passenger#{i}@fakemail.com",
    password:   '123123123',
    password_confirmation: '123123123',
    first_name: Faker::Name.first_name,
    last_name:  Faker::Name.last_name,
    phone:      Faker::PhoneNumber.phone_number(:gb),
    role:       Role[:passenger]
  }
end

(bookers.result + passengers.result).each do |member|
  next if member.passenger_addresses.any?

  PassengerAddress.create(passenger_id: member.id, address_id: address_1.id, type: 'work')
  PassengerAddress.create(passenger_id: member.id, address_id: address_2.id, type: 'home')
end

Seeds.seed(WorkRole, :name, 1..20) do |i|
  { name: "Work Role #{i}", company: company }
end

Seeds.seed(Department, :name, 1..20) do |i|
  { name: "Department #{i}", company: company }
end

Seeds.seed(TravelReason, :name, 1..20) do |i|
  { name: "Reason for Travel #{i}", company: company }
end

bookings = Seeds.seed_once(Booking, :id, 1..20) do |i|
  vehicle = Vehicle.all.sample

  {
    id:             i,
    booker:         company.bookers.sample,
    vehicle:        vehicle,
    fare_quote:     Faker::Number.number(4),
    message:        Faker::Lorem.sentence,
    status:         %w(completed cancelled rejected).sample,
    service_id:     i.to_s,
    payment_method: 'account',
    asap:           true,
    scheduled_at:   Time.current,
    booked_at:      Time.current
  }.tap do |attrs|
    if vehicle.splyt?
      attrs[:region_id]   = i.to_s
      attrs[:estimate_id] = i.to_s
    end

    if i.even?
      attrs[:passenger] = company.passengers.sample
    else
      attrs.merge!(
        passenger_first_name: Faker::Name.first_name,
        passenger_last_name:  Faker::Name.last_name,
        passenger_phone:      Faker::PhoneNumber.phone_number(:gb)
      )
    end
  end
end

bookings.result.each do |booking|
  next if booking.pickup_address.present?

  %w(pickup destination stop).each do |address_type|
    address = Address.create(
      line: Faker::Address.street_address,
      lat: Faker::Address.latitude,
      lng: Faker::Address.longitude,
      country_code: Faker::Address.country_code,
      city: Faker::Address.city
    )
    params = {
      address_id: address.id,
      address_type: address_type
    }
    params[:stop_info] = { name: Faker::Name.name, phone: Faker::PhoneNumber.phone_number(:gb) } if address_type == 'stop'
    booking.add_booking_address(params)
  end
end

DB.run("SELECT setval('bookings_id_seq', (SELECT MAX(id) FROM bookings))")
