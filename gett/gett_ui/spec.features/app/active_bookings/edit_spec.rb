require 'features_helper'

feature 'Active Bookings - Edit Order' do
  let(:bookings_page)     { Pages::App.bookings }
  let(:edit_booking_page) { Pages::App.edit_booking }
  let(:company)           { create(:company, :enterprise) }
  let(:passenger)         { create(:passenger, :with_home_address, company: company) }
  let(:order)             { wait_for { bookings_page.bookings.first } }
  let(:edited_order)      { wait_for { bookings_page.bookings.first } }

  scenario 'International Order' do
    create(:booking, :order_received, :scheduled, international: true, passenger: passenger, booker: company.admin)
    create(:passenger_address, :favorite, passenger: passenger)
    create(:location, company: company, address: create(:address, :baker_street))
    login_to_app_as(company.admin.email)

    bookings_page.load
    expect(bookings_page).to have_bookings(count: 1)
    order.open_details
    order.details.edit_order.click
    wait_until_true { edit_booking_page.loaded? }

    expect(edit_booking_page.international).to be_checked
    expect(edit_booking_page).to have_no_passenger_name
    expect(edit_booking_page).to have_no_phone_number
    expect(edit_booking_page).to have_no_i_am_passenger
    expect(edit_booking_page).to have_no_as_directed
    expect(edit_booking_page).to have_no_add_stop_point

    expect(edit_booking_page).not_to have_home_to_work_button
    expect(edit_booking_page).not_to have_work_to_home_button

    expect(edit_booking_page).to have_pickup_favourite_address_icon
    expect(edit_booking_page).to have_pickup_office_location_icon

    expect(edit_booking_page).to have_destination_favourite_address_icon
    expect(edit_booking_page).to have_destination_office_location_icon

    edit_booking_page.vehicles.wait_until_available
    expect(edit_booking_page.schedule_for_now).to be_disabled
    expect(edit_booking_page.schedule_for_later).to be_checked
    expect(edit_booking_page.schedule_recurring).to be_disabled

    with_headers do
      set_address_headers '48 Rue Ernest Renan, Bordeaux, France'
      set_mock_header google_maps: { details: { country_code: 'FR' } }
      edit_booking_page.pickup_address.select('48 Rue Ernest Renan, Bordeaux, France')
    end

    edit_booking_page.destination_address.select('221b Baker Street, London, UK')
    edit_booking_page.vehicles.wait_until_available
    expect(edit_booking_page.vehicles.available_cars_list).to include('Standard')
    edit_booking_page.vehicles.standard.click

    edit_booking_page.submit
    wait_until_true { bookings_page.loaded? }
    expect(bookings_page).to have_bookings(count: 1)

    expect(edited_order.journey.pickup_address.text).to include('48 Rue Ernest Renan')
    expect(edited_order.journey.destination_address.text).to include('221B Baker St')
  end

  feature 'Future Orders' do
    scenario 'Change addresses, Flight Number, Message for Driver and Payment Method' do
      cost_centre_reference = create(:booking_reference, :cost_centre, company: company)
      mandatory_reference = create(:booking_reference, :mandatory, company: company)

      booking = create(:booking, :scheduled, passenger: passenger, booker: company.admin, pickup_address: passenger.home_address, pickup_passenger_address_type: 'home')

      create(:booker_reference, booking: booking, value: 'cost_centre', booking_reference_name: cost_centre_reference.name)
      create(:booker_reference, booking: booking, value: 'banana', booking_reference_name: mandatory_reference.name)

      login_to_app_as(company.admin.email)

      edit_booking_page.load(order: booking.id)
      expect(edit_booking_page.international).not_to be_checked

      expect(edit_booking_page).to have_no_passenger_name
      expect(edit_booking_page).to have_no_phone_number
      expect(edit_booking_page).to have_no_i_am_passenger
      expect(edit_booking_page).to have_no_as_directed

      expect(edit_booking_page).not_to have_home_to_work_button
      expect(edit_booking_page).not_to have_work_to_home_button

      expect(edit_booking_page).to have_add_stop_point

      edit_booking_page.vehicles.wait_until_available
      expect(edit_booking_page.schedule_for_now).to be_disabled
      expect(edit_booking_page.schedule_for_later).to be_checked
      expect(edit_booking_page.schedule_recurring).to be_disabled

      with_headers do
        set_address_headers '312 Vauxhall Bridge Rd'
        edit_booking_page.pickup_address.select('312 Vauxhall Bridge Rd')
      end

      with_headers do
        set_address_headers 'Big Ben, London, UK'
        edit_booking_page.destination_address.select('Big Ben, London, UK')
      end

      edit_booking_page.vehicles.wait_until_available

      edit_booking_page.payment_method.select('Cash')
      edit_booking_page.message_to_driver.set('New message')
      edit_booking_page.flight_number.set('EK5')
      edit_booking_page.verify_flight_number_button.click

      edit_booking_page.submit
      wait_until_true { bookings_page.loaded? }
      expect(bookings_page).to have_bookings(count: 1)

      expect(order.payment_type.text).to eql('Cash')
      expect(order.journey.pickup_address.text).to include('312 Vauxhall Bridge Rd')
      expect(order.journey.destination_address.text).to include('Big Ben')

      order.open_details
      expect(order.details.message_to_driver.text).to eql('Flight: EK5, New message')
      expect(order.details.flight_number.text).to eql('EK5')
      # References are not available to edit
      expect(order.details.references.text).to include("#{cost_centre_reference.name}: cost_centre")
      expect(order.details.references.text).to include("#{mandatory_reference.name}: banana")
    end

    scenario 'Favourite Addresses as PickUp and Destination Addresses' do
      booking = create(:booking, :scheduled, passenger: passenger, booker: company.admin)
      pickup_favor = create(:passenger_address, :favorite, passenger: passenger, destination_message: Faker::Lorem.characters(10), pickup_message: Faker::Lorem.characters(10))
      dest_favor = create(:passenger_address, :favorite, passenger: passenger, destination_message: Faker::Lorem.characters(10), pickup_message: Faker::Lorem.characters(10))

      login_to_app_as(company.admin.email)
      edit_booking_page.load(order: booking.id)

      edit_booking_page.pickup_favourite_address_icon.click
      edit_booking_page.pickup_address.select(pickup_favor.name)

      edit_booking_page.destination_favourite_address_icon.click
      edit_booking_page.destination_address.select(dest_favor.name)

      edit_booking_page.submit
      wait_until_true { bookings_page.loaded? }
      expect(bookings_page).to have_bookings(count: 1)

      expect(order.journey.pickup_address.text).to eql(pickup_favor.address.line)
      expect(order.journey.destination_address.text).to eql(dest_favor.address.line)

      order.open_details
      expect(order.details.message_to_driver.text).to eql("Pick up: #{pickup_favor.pickup_message} Destination: #{dest_favor.destination_message}")
    end

    scenario 'Office Location Address as PickUp and Destination Addresses' do
      first_address = create(:address, :baker_street)
      second_address = create(:address, :mercedes_glasgow)
      first_ol = create(:location, company: company, address: first_address, destination_message: Faker::Lorem.characters(10), pickup_message: Faker::Lorem.characters(10))
      second_ol = create(:location, company: company, address: second_address, destination_message: Faker::Lorem.characters(10), pickup_message: Faker::Lorem.characters(10))

      booking = create(:booking, :scheduled, passenger: passenger, booker: company.admin)
      login_to_app_as(company.admin.email)
      edit_booking_page.load(order: booking.id)

      edit_booking_page.pickup_office_location_icon.click
      edit_booking_page.pickup_address.select(first_ol.name)

      edit_booking_page.destination_office_location_icon.click
      edit_booking_page.destination_address.select(second_ol.name)

      edit_booking_page.vehicles.wait_until_available
      edit_booking_page.submit
      wait_until_true { bookings_page.loaded? }
      expect(bookings_page).to have_bookings(count: 1)

      expect(order.journey.pickup_address.text).to eql(first_ol.address.line)
      expect(order.journey.destination_address.text).to eql(second_ol.address.line)

      order.open_details
      expect(order.details.message_to_driver.text).to eql("Pick up: #{first_ol.pickup_message} Destination: #{second_ol.destination_message}")
    end

    scenario 'POI as PickUp and Destination Addresses' do
      booking = create(:booking, :scheduled, passenger: passenger, booker: company.admin)
      login_to_app_as(company.admin.email)
      edit_booking_page.load(order: booking.id)

      edit_booking_page.pickup_address.select(PredefinedAddress.first.line)
      edit_booking_page.destination_address.select(PredefinedAddress.last.line)

      edit_booking_page.vehicles.wait_until_available
      edit_booking_page.submit
      wait_until_true { bookings_page.loaded? }
      expect(bookings_page).to have_bookings(count: 1)

      expect(edited_order.journey.pickup_address.text).to eql(PredefinedAddress.first.line)
      expect(edited_order.journey.destination_address.text).to eql(PredefinedAddress.last.line)
    end

    scenario 'Add, remove and change Stop Points' do
      booking = create(:booking, :scheduled, passenger: passenger, booker: company.admin)
      address_first = create(:address, :baker_street)
      address_second = create(:address, :mercedes_glasgow)
      create(:booking_address, booking_id: booking.id, address_id: address_first.id, address_type: 'stop', stop_info: { name: passenger.full_name, phone: passenger.phone, passenger_id: passenger.id })
      create(:booking_address, booking_id: booking.id, address_id: address_second.id, address_type: 'stop', stop_info: { name: 'Fake User', phone: '+44 1234 56789' })

      login_to_app_as(company.admin.email)
      edit_booking_page.load(order: booking.id)
      expect(edit_booking_page).to have_stop_points(count: 2)

      edit_booking_page.stop_points.second.remove_button.click
      expect(edit_booking_page).to have_stop_points(count: 1)
      edit_booking_page.submit
      expect(edit_booking_page.destination_address.error_message).to eql('this address is same as previous address')

      edit_booking_page.stop_points.first.name.select('New Old Passenger', autocomplete: false)
      edit_booking_page.stop_points.first.phone.set('4411224433')

      with_headers do
        set_address_headers '100 Baker Street, London, UK'
        edit_booking_page.stop_points.first.address.select('100 Baker Street, London, UK')
      end

      edit_booking_page.add_stop_point.click
      expect(edit_booking_page).to have_stop_points(count: 2)
      edit_booking_page.stop_points.second.name.select('Some Passenger', autocomplete: false)
      edit_booking_page.stop_points.second.phone.set('4444444444')

      with_headers do
        set_address_headers 'Big Ben, London, UK'
        edit_booking_page.stop_points.second.address.select('Big Ben, London, UK')
      end

      edit_booking_page.submit
      wait_until_true { bookings_page.bookings.present? }

      expect(bookings_page).to have_bookings(count: 1)
      order.open_details
      order.details.stop_points.click

      bookings_page.wait_until_stop_points_modal_visible
      expect(bookings_page.stop_points_modal).to have_points(count: 2)
      sp_list = bookings_page.stop_points_modal.points

      expect(sp_list.first.name.text).to eql('New Old Passenger')
      expect(sp_list.first.phone.text).to eql('+44 1122 4433')
      expect(sp_list.first.address.text).to include('100 Baker St')

      expect(sp_list.second.name.text).to eql('Some Passenger')
      expect(sp_list.second.phone.text).to eql('+44 4444 4444')
      expect(sp_list.second.address.text).to include('Big Ben')
    end
  end
end
