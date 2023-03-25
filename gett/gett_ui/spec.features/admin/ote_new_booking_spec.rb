require 'features_helper'

feature 'New Booking' do
  let(:booking_page)  { Pages::Admin.ote_new_booking }
  let(:bookings_page) { Pages::Admin.bookings }
  let(:new_order)     { wait_for { bookings_page.bookings.first } }

  scenario 'Affiliate should not have Multiple bookings and have only Black Taxis' do
    company = create(:company, :affiliate)
    login_as_super_admin
    booking_page.load

    booking_page.company_selector.select(company.name)
    booking_page.next_button.click

    booking_page.passenger_name.select(company.admin.full_name)
    booking_page.destination_address.select('221b Baker Street, London, UK')
    booking_page.vehicles.wait_until_available
    expect(booking_page.vehicles.available_cars_list).to match_array(['Black Taxi', 'Black Taxi XL'])

    expect(booking_page).to have_schedule_for_later
    booking_page.schedule_for_later.click
    expect(booking_page).to have_no_number_of_required_taxi
  end

  scenario 'Reference Validation if Booking Validation is turned on' do
    company = create(:company, bookings_validation_enabled: true)
    create(:booking_reference, :cost_centre, company: company)
    create(:booking_reference, :mandatory, company: company)

    login_as_super_admin
    booking_page.load

    booking_page.company_selector.select(company.name)
    booking_page.next_button.click

    expect(booking_page).to have_no_vehicles
    expect(booking_page).to have_text('Please Validate Reference(s) before placing Order(s)')

    booking_page.continue_button.click
    expect(booking_page).to have_text('We are sorry but references are not validated. Bookings not allowed')

    booking_page.references.second.field.set('business trip')
    booking_page.continue_button.click

    expect(booking_page).to have_vehicles
  end

  feature 'GDPR - HOME address should be displayed' do
    let(:company) { create(:company, :enterprise) }
    let!(:user) { create(:passenger, :with_home_address, company: company) }
    let(:work_address) { user.company.address.line }
    let(:home_address) { user.home_address.line }

    before do
      login_as_super_admin
      booking_page.load

      booking_page.company_selector.select(company.name)
      booking_page.next_button.click
      wait_until_true { booking_page.loaded? }
      booking_page.passenger_name.select(user.full_name)
    end

    it 'as Pickup Address' do
      booking_page.home_to_work_button.click
      expect(booking_page.pickup_address.selected_options).to eql(home_address)
      expect(booking_page.destination_address.selected_options).to eql(work_address)
      booking_page.vehicles.wait_until_available
      booking_page.save_button.click

      bookings_page.load
      wait_until_true { bookings_page.loaded? }
      expect(new_order).to have_journey(text: "#{home_address} #{work_address}")
    end

    it 'as Destination Address' do
      booking_page.work_to_home_button.click
      expect(booking_page.pickup_address.selected_options).to eql(work_address)
      expect(booking_page.destination_address.selected_options).to eql(home_address)
      booking_page.vehicles.wait_until_available
      booking_page.save_button.click

      bookings_page.load
      wait_until_true { bookings_page.loaded? }
      expect(new_order).to have_journey(text: "#{work_address} #{home_address}")
    end
  end

  scenario 'Display International Price and disable Stop Points' do
    company = create(:company, :enterprise)
    login_as_super_admin
    booking_page.load

    booking_page.company_selector.select(company.name)
    booking_page.next_button.click
    wait_until_true { booking_page.loaded? }

    booking_page.passenger_name.select(company.admin.full_name)
    expect(booking_page).to have_add_stop_point
    booking_page.international.click
    expect(booking_page).to have_no_add_stop_point(wait: 1)

    with_headers do
      set_address_headers '196 Rue Turenne, 33000 Bordeaux, France'
      set_mock_header google_maps: { details: { country_code: 'FR' } }
      booking_page.pickup_address.select('196 Rue Turenne, 33000 Bordeaux, France')
    end

    with_headers do
      set_address_headers company.address.line
      booking_page.destination_address.select(company.address.line)
    end

    booking_page.vehicles.wait_until_available
    expect(booking_page.vehicles.available_cars_list).to include('Standard')

    booking_page.vehicles.standard.click
    expect(booking_page.vehicles.description).to have_price(text: /£\d+\.\d+\* €\d+\.\d+/)
    # TODO: add Ru and IL providers and verify currency
  end

  scenario 'POI as PickUp and Destination Addresses' do
    pickup_poi = 'London Gatwick Airport South Terminal Arrivals'
    destination_poi = 'London Heathrow Airport Terminal 1 Departures'
    company = create(:company, :enterprise)
    login_as_super_admin
    booking_page.load

    booking_page.company_selector.select(company.name)
    booking_page.next_button.click
    wait_until_true { booking_page.loaded? }

    booking_page.passenger_name.select(company.admin.full_name)
    booking_page.pickup_address.select(pickup_poi)
    booking_page.destination_address.select(destination_poi)
    booking_page.vehicles.wait_until_available
    booking_page.save_button.click

    bookings_page.load
    wait_until_true { bookings_page.loaded? }

    expect(new_order.journey.pickup_address.text).to eql(pickup_poi)
    expect(new_order.journey.destination_address.text).to eql(destination_poi)
  end

  scenario 'Favourite Addresses as PickUp and Destination Addresses' do
    company = create(:company, :enterprise)
    pickup_favor = create(:passenger_address, :favorite, passenger: company.admin, destination_message: Faker::Lorem.characters(10), pickup_message: Faker::Lorem.characters(10))
    dest_favor = create(:passenger_address, :favorite, passenger: company.admin, destination_message: Faker::Lorem.characters(10), pickup_message: Faker::Lorem.characters(10))

    login_as_super_admin
    booking_page.load

    booking_page.company_selector.select(company.name)
    booking_page.next_button.click
    wait_until_true { booking_page.loaded? }

    booking_page.passenger_name.select(company.admin.full_name)
    booking_page.pickup_favourite_address_icon.click
    booking_page.pickup_address.select(pickup_favor.name)

    booking_page.destination_favourite_address_icon.click
    booking_page.destination_address.select(dest_favor.name)

    booking_page.vehicles.wait_until_available
    booking_page.save_button.click

    bookings_page.load
    wait_until_true { bookings_page.loaded? }

    expect(new_order.journey.pickup_address.text).to eql(pickup_favor.address.line)
    expect(new_order.journey.destination_address.text).to eql(dest_favor.address.line)

    new_order.open_details
    expect(new_order.details.message_to_driver.text).to eql("Pick up: #{pickup_favor.pickup_message} Destination: #{dest_favor.destination_message}")
  end

  scenario 'Office Location Address as PickUp and Destination Addresses' do
    company = create(:company, :enterprise)
    first_address = create(:address, :baker_street)
    second_address = create(:address, :mercedes_glasgow)
    first_ol = create(:location, company: company, address: first_address, destination_message: Faker::Lorem.characters(10), pickup_message: Faker::Lorem.characters(10))
    second_ol = create(:location, company: company, address: second_address, destination_message: Faker::Lorem.characters(10), pickup_message: Faker::Lorem.characters(10))

    login_as_super_admin
    booking_page.load

    booking_page.company_selector.select(company.name)
    booking_page.next_button.click
    wait_until_true { booking_page.loaded? }

    booking_page.passenger_name.select(company.admin.full_name)

    booking_page.pickup_office_location_icon.click
    booking_page.pickup_address.select(first_ol.name)

    booking_page.destination_office_location_icon.click
    booking_page.destination_address.select(second_ol.name)

    booking_page.vehicles.wait_until_available
    booking_page.save_button.click

    bookings_page.load
    wait_until_true { bookings_page.loaded? }

    expect(new_order.journey.pickup_address.text).to eql(first_ol.address.line)
    expect(new_order.journey.destination_address.text).to eql(second_ol.address.line)

    new_order.open_details
    expect(new_order.details.message_to_driver.text).to eql("Pick up: #{first_ol.pickup_message} Destination: #{second_ol.destination_message}")
  end

  feature 'Access to booking form without' do
    scenario 'Company Payment Card for CPC company' do
      company = create(:company, :enterprise, payment_types: %w[company_payment_card], default_payment_type: 'company_payment_card')

      login_as_super_admin
      booking_page.load
      booking_page.company_selector.select(company.name)
      booking_page.next_button.click
      wait_until_true { booking_page.loaded? }

      booking_page.passenger_name.select(company.admin.full_name)
      booking_page.as_directed.click
      booking_page.vehicles.wait_until_available
      booking_page.save_button.click
      expect(booking_page.payment_method.error_message).to eql('Please add Credit/Debit card before ordering a taxi or contact your administrator')
    end

    scenario 'personal payment card' do
      company = create(:company, :enterprise, :passenger_payment_card)

      login_as_super_admin
      booking_page.load
      booking_page.company_selector.select(company.name)
      booking_page.next_button.click
      wait_until_true { booking_page.loaded? }

      booking_page.passenger_name.select(company.admin.full_name)
      booking_page.as_directed.click
      booking_page.vehicles.wait_until_available
      booking_page.save_button.click
      expect(booking_page.payment_method.error_message).to have_text('Sorry, you have no Credit/Debit cards added in your profile')
    end
  end

  scenario 'Multiple Booking and As Directed Option' do
    company = create(:company, :enterprise, multiple_booking: true)

    login_as_super_admin
    booking_page.load
    booking_page.company_selector.select(company.name)
    booking_page.next_button.click
    wait_until_true { booking_page.loaded? }

    booking_page.passenger_name.select(company.admin.full_name)
    booking_page.as_directed.click
    booking_page.schedule_for_later.click
    booking_page.vehicles.wait_until_available
    expect(booking_page).to have_number_of_required_taxi(text: 1)
    booking_page.number_of_required_taxi.select(2)
    booking_page.vehicles.wait_until_available
    booking_page.save_button.click

    bookings_page.load
    expect(bookings_page).to have_bookings(count: 2)
  end

  scenario 'Stop Points' do
    passenger = build(:passenger, phone: '+44711658875')
    company = create(:company, :enterprise)

    login_as_super_admin
    booking_page.load
    booking_page.company_selector.select(company.name)
    booking_page.next_button.click
    wait_until_true { booking_page.loaded? }

    booking_page.passenger_name.select(passenger.full_name, autocomplete: false)
    booking_page.phone_number.set(passenger.phone)
    booking_page.destination_address.select('221b Baker Street, London, UK')

    booking_page.add_stop_point.click
    expect(booking_page).to have_stop_points(count: 1)

    booking_page.save_button.click

    expect(booking_page.stop_points.first.name.error_message).to eql("can't be blank")
    expect(booking_page.stop_points.first.phone.error_message).to eql("Please add in the passenger's phone number")
    expect(booking_page.stop_points.first.address.error_message).to eql('Please add in the pickup.')

    booking_page.stop_points.first.name.select('Some Passenger', autocomplete: false)
    booking_page.stop_points.first.phone.set('4444444444')

    with_headers do
      set_address_headers 'Big Ben, London, UK'
      booking_page.stop_points.first.address.select('Big Ben, London, UK')
    end

    booking_page.add_stop_point.click
    expect(booking_page).to have_stop_points(count: 2)

    booking_page.stop_points.second.same_passenger_as_for_main_booking.click
    expect(booking_page.stop_points.second.name.selected_options).to eql(passenger.full_name)
    expect(booking_page.stop_points.second.phone.stripped_value).to eql(passenger.phone)
    with_headers do
      set_address_headers 'Big Ben, London, UK'
      booking_page.stop_points.second.address.select('Big Ben, London, UK')
    end

    booking_page.vehicles.wait_until_available
    booking_page.save_button.click
    expect(booking_page.stop_points.second.address.error_message).to eql('this address is same as previous address')

    with_headers do
      set_address_headers '100 Baker Street, London, UK'
      booking_page.stop_points.second.address.select('100 Baker Street, London, UK')
    end

    booking_page.save_button.click
    bookings_page.load
    wait_until_true { bookings_page.bookings.present? }
    expect(bookings_page).to have_bookings(count: 1)

    new_order.open_details
    new_order.details.stop_points.click

    bookings_page.wait_until_stop_points_modal_visible
    expect(bookings_page.stop_points_modal).to have_points(count: 2)
    sp_list = bookings_page.stop_points_modal.points

    expect(sp_list.first.name.text).to eql('Some Passenger')
    expect(sp_list.first.phone.text).to eql('+44 4444 4444')
    expect(sp_list.first.address.text).to include('Big Ben')

    expect(sp_list.second.name.text).to eql(passenger.full_name)
    expect(sp_list.second.phone.text).to eql('+44 7116 58875')
    expect(sp_list.second.address.text).to include('100 Baker St')
  end

  scenario 'Base Validations' do
    company = create(:company, :enterprise)
    create(:company, :enterprise, :inactive)
    passenger = create(:passenger, company: company, default_vehicle: 'Standard')

    login_as_super_admin
    booking_page.load
    expect(booking_page.company_selector.available_options).to eql([company.name])

    booking_page.company_selector.select(company.name)
    booking_page.next_button.click
    wait_until_true { booking_page.loaded? }

    expect(booking_page.pickup_address.selected_options).to eql('167 Fleet St, London EC4A 2EA, UK')
    expect(booking_page.payment_method.selected_options).to eql('Account')
    expect(booking_page.payment_method.available_options).to match_array(%w(Account Cash))

    booking_page.save_button.click
    expect(booking_page.passenger_name.error_message).to eql("Please add in the passenger's name")
    expect(booking_page.phone_number.error_message).to eql("Please add in the passenger's phone number")
    expect(booking_page.destination_address.error_message).to eql("Please add in the destination.")

    booking_page.passenger_name.select(passenger.full_name)
    booking_page.destination_address.select('221b Baker Street, London, UK')
    booking_page.vehicles.wait_until_available
    expect(booking_page.vehicles.selected_car).to eql('Standard')

    booking_page.passenger_name.select('Ne{w^Pas|seng]er Na%me', autocomplete: false)
    booking_page.phone_number.set('4/4 1}4[53 ^93%01|')
    booking_page.vehicles.wait_until_available
    booking_page.save_button.click
    expect(booking_page.passenger_name.error_message).to eql("Invalid name. Avoid using special symbols")

    fake_name = Faker::Lorem.characters(35)
    booking_page.passenger_name.select(fake_name, autocomplete: false)
    booking_page.vehicles.wait_until_available

    booking_page.flight_number.set('some')
    booking_page.verify_flight_number_button.click
    expect(booking_page).to have_text('Flight number not found, please double check.')

    booking_page.flight_number.set('EK5')
    booking_page.verify_flight_number_button.click
    expect(booking_page).to have_flight_stats

    booking_page.message_to_driver.set('Hurry Up!')
    booking_page.save_button.click

    bookings_page.load
    wait_until_true { bookings_page.bookings.present? }
    expect(bookings_page).to have_bookings(count: 1)
    new_order.open_details

    expect(new_order.details.passenger_name.text).to eql(fake_name[0...35])
    expect(new_order.details.passenger_phone.text).to eql('+44 1453 9301')
    expect(new_order.details.message_to_driver.text).to eql('Flight: EK5, Hurry Up!')
    expect(new_order.details.flight_number.text).to eql('EK5')
  end
end
