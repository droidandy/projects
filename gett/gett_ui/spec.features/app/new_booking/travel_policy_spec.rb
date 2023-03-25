require 'features_helper'

feature 'New Booking - Travel Policy' do
  let(:travel_policy_page) { Pages::App.travel_policy }
  let(:company)            { create(:company, :enterprise) }
  let(:new_booking_page)   { Pages::App.new_booking }
  let(:baker_street)       { '221b Baker Street, London, UK' }

  before { login_to_app_as(company.admin.email) }

  feature 'People Rules' do
    scenario 'Guest Users' do
      create(:travel_rule, company: company, vehicles: ['BlackTaxi', 'Standard'])

      new_booking_page.passenger_name.select(Faker::Name.first_name, autocomplete: false)
      new_booking_page.phone_number.set(Faker::PhoneNumber.phone_number(:gb))
      new_booking_page.destination_address.select(baker_street)
      new_booking_page.vehicles.wait_until_available
      expect(new_booking_page.vehicles.available_cars_list).to include('Black Taxi', 'Standard')

      new_booking_page.payment_method.select('Cash')
      new_booking_page.vehicles.wait_until_available
      expect(new_booking_page.vehicles.available_cars_list.count).to eql(2)
    end

    scenario 'Department rule' do
      departments = create_list(:department, 3, company: company)
      passenger = create(:passenger, :with_personal_payment_card, allow_personal_card_usage: true, company: company, department: departments[2])
      create(:travel_rule, company: company, departments: departments, vehicles: ['Standard'])

      new_booking_page.load
      new_booking_page.passenger_name.select(passenger.full_name)
      BM.sleep 0.5
      new_booking_page.destination_address.select(baker_street)
      new_booking_page.vehicles.wait_until_available
      expect(new_booking_page.vehicles.available_cars_list).to match_array(['Standard'])

      new_booking_page.payment_method.select('Personal payment card')
      new_booking_page.vehicles.wait_until_available
      expect(new_booking_page.vehicles.available_cars_list.count).to be > 2
    end

    scenario 'Work Role rule' do
      work_roles = create_list(:work_role, 3, company: company)
      passenger = create(:passenger, company: company, work_role: work_roles[2])
      create(:travel_rule, company: company, work_roles: work_roles, vehicles: ['Standard'])

      new_booking_page.load
      new_booking_page.passenger_name.select(passenger.full_name)
      new_booking_page.destination_address.select(baker_street)
      new_booking_page.vehicles.wait_until_available
      expect(new_booking_page.vehicles.available_cars_list).to include('Standard')
    end

    scenario 'Rule for selected user' do
      passenger = create(:passenger, :with_business_payment_card, allow_personal_card_usage: true, company: company)
      create(:travel_rule, company: company, members: [passenger], vehicles: ['BlackTaxi', 'BlackTaxiXL'])

      new_booking_page.load
      new_booking_page.passenger_name.select(passenger.full_name)
      BM.sleep 0.5
      new_booking_page.destination_address.select(baker_street)
      new_booking_page.vehicles.wait_until_available
      expect(new_booking_page.vehicles.available_cars_list).to include('Black Taxi', 'Black Taxi XL')

      new_booking_page.payment_method.select('Business payment card')
      new_booking_page.vehicles.wait_until_available
      expect(new_booking_page.vehicles.available_cars_list).to include('Black Taxi', 'Black Taxi XL')
    end
  end

  scenario 'Location Rule' do
    create(:travel_rule, company: company, location: 'CentralLondon', vehicles: ['Standard', 'BlackTaxiXL'])

    new_booking_page.load
    new_booking_page.passenger_name.select(Faker::Name.first_name, autocomplete: false)
    new_booking_page.phone_number.set(Faker::PhoneNumber.phone_number(:gb))

    new_booking_page.pickup_address.select('London Heathrow Airport Terminal 1 Arrivals')
    new_booking_page.destination_address.select(baker_street)

    new_booking_page.vehicles.wait_until_available
    expect(new_booking_page.vehicles.available_cars_list.count).to be > 2

    set_mock_header google_maps: { details: { lat: 51.5073889, lng: -0.1452095 } }
    new_booking_page.pickup_address.select(baker_street)
    clear_all_headers
    new_booking_page.destination_address.select('London Heathrow Airport Terminal 1 Arrivals')
    new_booking_page.vehicles.wait_until_available
    wait_until_true { new_booking_page.vehicles.available_cars_list.size > 1 }
    expect(new_booking_page.vehicles.available_cars_list).to match_array(['Black Taxi XL', 'Standard'])
  end

  scenario 'Distance Rules' do
    create(:travel_rule, company: company, min_distance: 2, max_distance: 5, vehicles: ['Standard', 'BlackTaxiXL'])
    create(:travel_rule, company: company, min_distance: 5, max_distance: 10, vehicles: ['BlackTaxi'])

    new_booking_page.load
    new_booking_page.passenger_name.select(Faker::Name.first_name, autocomplete: false)
    new_booking_page.phone_number.set(Faker::PhoneNumber.phone_number(:gb))

    set_mock_header google_maps: { distance_matrix: { distance: '3'} }
    new_booking_page.destination_address.select(baker_street)
    new_booking_page.vehicles.wait_until_available
    wait_until_true { new_booking_page.vehicles.available_cars_list.sort == ['Black Taxi XL', 'Standard'].sort }
    expect(new_booking_page.vehicles.available_cars_list).to match_array(['Black Taxi XL', 'Standard'])

    set_mock_header google_maps: { distance_matrix: { distance: '7'} }
    new_booking_page.destination_address.select '221b Baker Street, London, UK'
    new_booking_page.vehicles.wait_until_available
    wait_until_true { new_booking_page.vehicles.available_cars_list.sort == ['Black Taxi'].sort }
    expect(new_booking_page.vehicles.available_cars_list).to match_array(['Black Taxi'])
  end

  # Pending untill we find a way to get persistent and predictable vehicles from Gett
  xscenario 'Cheapest Rule and Deactivated Rule' do
    create(:travel_rule, company: company, cheapest: true)

    new_booking_page.load
    new_booking_page.passenger_name.select(Faker::Name.first_name, autocomplete: false)
    new_booking_page.phone_number.set(Faker::PhoneNumber.phone_number(:gb))
    new_booking_page.destination_address.select(baker_street)
    new_booking_page.vehicles.wait_until_available
    expect(new_booking_page.vehicles.available_cars_list).to include('Black Taxi', 'Black Taxi XL')

    travel_policy_page.load
    wait_until_true { travel_policy_page.rules.present? }
    travel_policy_page.rules.first.active.click
    expect(travel_policy_page.rules.first.active).not_to be_checked

    new_booking_page.load
    new_booking_page.passenger_name.select(Faker::Name.first_name, autocomplete: false)
    new_booking_page.phone_number.set(Faker::PhoneNumber.phone_number(:gb))
    new_booking_page.destination_address.select(baker_street)
    new_booking_page.vehicles.wait_until_available
    expect(new_booking_page.vehicles.available_cars_list.count).to be > 2
  end

  scenario 'Priority of rule' do
    create(:travel_rule, company: company, name: 'First', vehicles: ['Standard', 'BlackTaxiXL'])
    create(:travel_rule, company: company, name: 'Second', vehicles: ['BlackTaxi'])

    new_booking_page.load
    new_booking_page.passenger_name.select(Faker::Name.first_name, autocomplete: false)
    new_booking_page.phone_number.set(Faker::PhoneNumber.phone_number(:gb))
    new_booking_page.destination_address.select(baker_street)
    new_booking_page.vehicles.wait_until_available
    expect(new_booking_page.vehicles.available_cars_list).to include('Black Taxi XL', 'Standard')

    travel_policy_page.load
    wait_until_true { travel_policy_page.rules.size > 1 }

    travel_policy_page.rules.second.change_priority_with(travel_policy_page.rules.first)
    expect(travel_policy_page).to have_rules(count: 2)
    expect(travel_policy_page.rules.first.rule.text).to eql('Second')

    new_booking_page.load
    new_booking_page.passenger_name.select(Faker::Name.first_name, autocomplete: false)
    new_booking_page.phone_number.set(Faker::PhoneNumber.phone_number(:gb))
    new_booking_page.destination_address.select(baker_street)
    new_booking_page.vehicles.wait_until_available
    expect(new_booking_page.vehicles.available_cars_list).to include('Black Taxi')
  end
end
