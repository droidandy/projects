require 'features_helper'

feature 'New Booking' do
  let(:new_booking_page) { Pages::App.new_booking }
  let(:bookings_page)    { Pages::App.bookings }

  scenario 'Multiple Booking and Default Driver Message' do
    company = create(:company, :enterprise, multiple_booking: true, booker_notifications: true, default_driver_message: 'Hurry Up!')
    login_to_app_as(company.admin.email)
    new_booking_page.load

    new_booking_page.passenger_name.select(Faker::Name.first_name, autocomplete: false)
    new_booking_page.phone_number.set(Faker::PhoneNumber.phone_number(:gb))

    new_booking_page.destination_address.select('221b Baker Street, London, UK')
    new_booking_page.vehicles.wait_until_available

    new_booking_page.schedule_for_later.click
    new_booking_page.vehicles.wait_until_available

    expect(new_booking_page).to have_number_of_required_taxi(text: 1)
    expect(new_booking_page).to have_message_to_driver(text: 'Hurry Up!')

    new_booking_page.number_of_required_taxi.select(2)
    new_booking_page.vehicles.wait_until_available

    new_booking_page.save_button.click

    bookings_page.load
    expect(bookings_page).to have_bookings(count: 2)
    bookings_page.bookings.first.open_details
    expect(bookings_page.bookings.first.details).to have_message_to_driver(text: 'Hurry Up!')
  end

  # Pending due to https://gett-uk.atlassian.net/browse/OU-3026
  scenario 'Trader Price' do
    company = create(:company, :enterprise, quote_price_increase_percentage: 100.0, quote_price_increase_pounds: 1.0)
    login_to_app_as(company.admin.email)
    expect(new_booking_page).to be_displayed

    new_booking_page.i_am_passenger.click
    expect(new_booking_page.pickup_address.selected_options).to eql('167 Fleet St, London EC4A 2EA, UK')
    new_booking_page.destination_address.select('221b Baker Street, London, UK')
    new_booking_page.vehicles.wait_until_available
    new_booking_page.vehicles.standard.click
    expect(new_booking_page.vehicles.selected_car).to eql('Standard')

    regular_price = new_booking_page.vehicles.description.price.text.match(/\d+\.\d+/)[0].to_f
    trader_price = new_booking_page.vehicles.description.trader_price.text.match(/\d+\.\d+/)[0].to_f
    expect(trader_price).to eql((regular_price * 2 + 1))
  end

  scenario 'POI as PickUp and Destination Addresses' do
    pickup_poi = 'London Gatwick Airport South Terminal Arrivals'
    destination_poi = 'London Heathrow Airport Terminal 1 Departures'
    company = create(:company, :enterprise)
    login_to_app_as(company.admin.email)
    expect(new_booking_page).to be_displayed

    new_booking_page.i_am_passenger.click
    new_booking_page.pickup_address.select(pickup_poi)
    new_booking_page.destination_address.select(destination_poi)
    new_booking_page.vehicles.wait_until_available
    new_booking_page.save_button.click

    wait_until_true { bookings_page.bookings.present? }

    order = bookings_page.bookings.first
    expect(order.journey.pickup_address.text).to eql(pickup_poi)
    expect(order.journey.destination_address.text).to eql(destination_poi)
  end

  scenario 'Stop Points' do
    passenger = build(:passenger, phone: '+44714404123')
    company = create(:company, :enterprise)
    login_to_app_as(company.admin.email)
    expect(new_booking_page).to be_displayed

    new_booking_page.passenger_name.select(passenger.full_name, autocomplete: false)
    new_booking_page.phone_number.set(passenger.phone)
    new_booking_page.destination_address.select('221b Baker Street, London, UK')

    new_booking_page.add_stop_point.click
    expect(new_booking_page).to have_stop_points(count: 1)

    new_booking_page.submit

    expect(new_booking_page.stop_points.first.name.error_message).to eql("can't be blank")
    expect(new_booking_page.stop_points.first.phone.error_message).to eql("Please add in the passenger's phone number")
    expect(new_booking_page.stop_points.first.address.error_message).to eql('Please add in the pickup.')

    new_booking_page.stop_points.first.name.select('Some Passenger', autocomplete: false)
    new_booking_page.stop_points.first.phone.set('4444444444')

    with_headers do
      set_address_headers 'Big Ben, London, UK'
      new_booking_page.stop_points.first.address.select('Big Ben, London, UK')
    end

    new_booking_page.add_stop_point.click
    expect(new_booking_page).to have_stop_points(count: 2)

    new_booking_page.stop_points.second.i_am_passenger.click
    expect(new_booking_page.stop_points.second.name.selected_options).to eql(company.admin.full_name)
    expect(new_booking_page.stop_points.second.phone.stripped_value).to eql(company.admin.phone)

    with_headers do
      set_address_headers 'Big Ben, London, UK'
      new_booking_page.stop_points.second.address.select('Big Ben, London, UK')
    end

    new_booking_page.add_stop_point.click
    expect(new_booking_page).to have_stop_points(count: 3)
    new_booking_page.stop_points.third.same_passenger_as_for_main_booking.click
    expect(new_booking_page.stop_points.third.name.selected_options).to eql(passenger.full_name)
    expect(new_booking_page.stop_points.third.phone.stripped_value).to eql(passenger.phone)
    new_booking_page.stop_points.third.address.select('221b Baker Street, London, UK')

    new_booking_page.vehicles.wait_until_available
    new_booking_page.submit

    expect(new_booking_page.stop_points.second.address.error_message).to eql('this address is same as previous address')
    expect(new_booking_page.destination_address.error_message).to eql('this address is same as previous address')

    new_booking_page.stop_points.second.remove_button.click
    expect(new_booking_page).to have_stop_points(count: 2)

    with_headers do
      set_address_headers '100 Baker Street, London, UK'
      new_booking_page.stop_points.second.address.select('100 Baker Street, London, UK')
    end

    new_booking_page.submit
    wait_until_true { bookings_page.bookings.present? }

    expect(bookings_page).to have_bookings(count: 1)
    bookings_page.bookings.first.open_details
    bookings_page.bookings.first.details.stop_points.click

    bookings_page.wait_until_stop_points_modal_visible
    expect(bookings_page.stop_points_modal).to have_points(count: 2)
    sp_list = bookings_page.stop_points_modal.points

    expect(sp_list.first.name.text).to eql('Some Passenger')
    expect(sp_list.first.phone.text).to eql('+44 4444 4444')
    expect(sp_list.first.address.text).to include('Big Ben')

    expect(sp_list.second.name.text).to eql(passenger.full_name)
    expect(sp_list.second.phone.text).to eql('+44 7144 04123')
    expect(sp_list.second.address.text).to include('100 Baker St')
  end

  scenario 'Flight No' do
    company = create(:company, :enterprise)
    login_to_app_as(company.admin.email)
    expect(new_booking_page).to be_displayed

    new_booking_page.i_am_passenger.click
    new_booking_page.destination_address.select('221b Baker Street, London, UK')

    new_booking_page.flight_number.set('some')
    new_booking_page.verify_flight_number_button.click
    expect(new_booking_page).to have_text('Flight number not found, please double check.')

    new_booking_page.flight_number.set('EK5')
    new_booking_page.verify_flight_number_button.click
    expect(new_booking_page).to have_flight_stats

    new_booking_page.submit
    wait_until_true { bookings_page.bookings.present? }
    expect(bookings_page).to have_bookings(count: 1)
    bookings_page.bookings.first.open_details

    expect(bookings_page.bookings.first.details.message_to_driver.text).to eql('Flight: EK5')
    expect(bookings_page.bookings.first.details.flight_number.text).to eql('EK5')
  end

  scenario 'Base Field Validations' do
    company = create(:company, :enterprise)
    passenger = create(:passenger, :with_personal_payment_card, company: company, mobile: Faker::PhoneNumber.phone_number(:gb))
    create(:passenger, :inactive, company: company)
    booker = create(:booker, company: company)
    user_list = [company.admin.full_name, passenger.full_name, booker.full_name]

    login_to_app_as(company.admin.email)
    expect(new_booking_page).to be_displayed
    expect(new_booking_page.pickup_address.selected_options).to eql('167 Fleet St, London EC4A 2EA, UK')
    expect(new_booking_page.passenger_name.available_options).to match_array(user_list)
    expect(new_booking_page.payment_method.available_options).to match_array(%w(Account Cash))

    new_booking_page.submit
    expect(new_booking_page.passenger_name.error_message).to eql("Please add in the passenger's name")
    expect(new_booking_page.phone_number.error_message).to eql("Please add in the passenger's phone number")
    expect(new_booking_page.destination_address.error_message).to eql("Please add in the destination.")

    new_booking_page.passenger_name.select('Ne{w^Pas|seng]er Na%me', autocomplete: false)
    new_booking_page.phone_number.set('4/4 1}4[53 ^93%01|')
    new_booking_page.destination_address.select('221b Baker Street, London, UK')
    new_booking_page.vehicles.wait_until_available
    new_booking_page.submit
    expect(new_booking_page.passenger_name.error_message).to eql("Invalid name. Avoid using special symbols")
    new_booking_page.phone_number.set('+013127773655')
    expect(new_booking_page.phone_number.error_message).to eql('Invalid phone format. Phone should start with country dial code')
    new_booking_page.phone_number.set('+3800953838388')
    expect(new_booking_page.phone_number.error_message).to eql('Invalid phone format. Please remove 0 after country dial code')
    new_booking_page.phone_number.set('+380954545245')

    fake_name = Faker::Lorem.characters(35)
    new_booking_page.passenger_name.select(fake_name, autocomplete: false)
    new_booking_page.vehicles.wait_until_available
    new_booking_page.submit

    expect(bookings_page).to have_bookings(count: 1)
    bookings_page.bookings.first.open_details
    expect(bookings_page.bookings.first.details.passenger_name.text).to eql(fake_name[0...35]) # TODO: should be 30 symbols limit
    expect(bookings_page.bookings.first.details.passenger_phone.text).to eql('+380(95)454-52-45')
  end
end
