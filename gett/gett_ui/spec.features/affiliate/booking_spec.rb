require 'features_helper'

feature 'Affiliate Booking' do
  let(:bookings_page) { Pages::Affiliate.bookings }
  let(:company)       { create(:company, :affiliate, admin_phone: '+44755215400') }

  before do
    login_to_affiliate_as(company.admin.email)
    wait_until_true { bookings_page.loaded? }
    expect(bookings_page).to have_company_name(text: company.name)
    expect(bookings_page).to have_company_address(text: company.address.line)
    expect(bookings_page.book_asap).to be_checked
    expect(bookings_page).to have_bookings_list(text: 'No Active Orders Customer Support 0207 788 8987')
    expect(bookings_page.as_directed).to be_checked
    expect(bookings_page.pickup_address.selected_options).to eql(company.address.line)
    expect(bookings_page.destination_address).to be_disabled
    expect(bookings_page.date_picker).to be_disabled
    expect(bookings_page.time_picker.hours).to be_disabled
    expect(bookings_page.time_picker.minutes).to be_disabled
  end

  feature 'Book ASAP' do
    scenario 'as directed' do
      # PickUp address can't be blank
      bookings_page.pickup_address.select(' ', autocomplete: false)
      bookings_page.order_ride.click
      expect(bookings_page.pickup_address.error_message).to eql("Address not found. Please check the address entered.")

      with_headers do
        set_address_headers 'Kharkiv River'
        set_mock_header google_maps: { details: { country_code: nil } }
        bookings_page.pickup_address.select('Kharkiv River')
      end
      bookings_page.order_ride.click
      expect(bookings_page.pickup_address.error_message).to eql("Sorry, this address is not supported by our system")

      # Create order only without passenger's information
      bookings_page.pickup_address.select('London City Airport Arrivals')
      bookings_page.order_ride.click
      expect(bookings_page.bookings_list).to have_bookings
      wait_until_true(timeout: 20) { bookings_page.bookings_list.bookings.first.text == "585 - Order received - Company: #{company.name}" }
      bookings_page.bookings_list.bookings.first.title.click

      expect(bookings_page.ride_details).to have_status(text: 'Order received')
      expect(bookings_page.ride_details).to have_ride_type(text: 'BlackTaxi')
      expect(bookings_page.ride_details).to have_payment_method(text: 'Cash')
      expect(bookings_page.ride_details.pickup_time.text.in_time_zone('Europe/London')).to be_within(2.minutes).of(Time.current.in_time_zone('Europe/London'))
      expect(bookings_page.ride_details).to have_pickup_address(text: 'London City Airport Arrivals')
      expect(bookings_page.ride_details).to have_name_and_phone(text: "Company: #{company.name}, +44 7552 15400")

      bookings_page.ride_details.close_button.click
      bookings_page.wait_until_ride_details_invisible

      # Create order with full passenger's information
      expect(bookings_page.pickup_address.selected_options).to eql(company.address.line)
      bookings_page.room.set('777')
      bookings_page.name.set('James Bond')
      bookings_page.phone.set('+44 7123 45678')
      bookings_page.message_to_driver.set('My name is Bond, James Bond!')
      bookings_page.order_ride.click

      expect(bookings_page.bookings_list).to have_bookings(count: 2)
      wait_until_true(timeout: 20) { bookings_page.bookings_list.bookings.first.text == '585 - Order received - James Bond, Room: 777' }
      bookings_page.bookings_list.bookings.first.title.click

      expect(bookings_page).to have_ride_details
      expect(bookings_page.ride_details).to have_status(text: 'Order received')
      expect(bookings_page.ride_details).to have_ride_type(text: 'BlackTaxi')
      expect(bookings_page.ride_details).to have_payment_method(text: 'Cash')
      expect(bookings_page.ride_details.pickup_time.text.in_time_zone('Europe/London')).to be_within(2.minutes).of(Time.current.in_time_zone('Europe/London'))
      expect(bookings_page.ride_details).to have_pickup_address(text: company.address.line)
      expect(bookings_page.ride_details).to have_name_and_phone(text: 'James Bond, Room: 777, +44 7123 45678')
      expect(bookings_page.ride_details).to have_message_to_driver(text: 'My name is Bond, James Bond!')

      bookings_page.ride_details.close_button.click
      bookings_page.wait_until_ride_details_invisible
    end

    scenario 'not as directed' do
      bookings_page.as_directed.click
      expect(bookings_page.as_directed).to_not be_checked

      # Destination can't be blank
      bookings_page.order_ride.click
      expect(bookings_page.destination_address.error_message).to eql("can't be blank")

      bookings_page.destination_address.select('221b Baker Street, London, UK')
      bookings_page.order_ride.click
      expect(bookings_page.bookings_list).to have_bookings
      wait_until_true(timeout: 20) { bookings_page.bookings_list.bookings.first.text == "585 - Order received - Company: #{company.name}" }
      bookings_page.bookings_list.bookings.first.title.click

      expect(bookings_page.ride_details).to have_status(text: 'Order received')
      expect(bookings_page.ride_details).to have_ride_type(text: 'BlackTaxi')
      expect(bookings_page.ride_details).to have_payment_method(text: 'Cash')
      expect(bookings_page.ride_details.pickup_time.text.in_time_zone('Europe/London')).to be_within(2.minutes).of(Time.current.in_time_zone('Europe/London'))
      expect(bookings_page.ride_details).to have_pickup_address(text: company.address.line)
      expect(bookings_page.ride_details).to have_destination_address(text: '221B Baker St, Marylebone, London NW1 6XE, UK')
      expect(bookings_page.ride_details).to have_name_and_phone(text: "Company: #{company.name}, +44 7552 15400")

      bookings_page.ride_details.close_button.click
      bookings_page.wait_until_ride_details_invisible
    end
  end

  scenario 'Pre-Book' do
    bookings_page.pre_book.click
    expect(bookings_page.pre_book).to be_checked
    expect(bookings_page.pickup_address.selected_options).to eql(company.address.line)

    expect(bookings_page.date_picker).not_to be_disabled
    expect(bookings_page.time_picker.hours).not_to be_disabled
    expect(bookings_page.time_picker.minutes).not_to be_disabled

    pre_book_time = Time.parse("#{bookings_page.date_picker.value} #{bookings_page.time_picker.hours.text.to_i}:#{bookings_page.time_picker.minutes.text.to_i} UTC")
    expect(pre_book_time).to be_within(5.minutes).of(Time.current.in_time_zone('Europe/London') +
      Vehicle.first(name: 'BlackTaxi').earliest_available_in.minutes)

    # Check required field
    bookings_page.phone.clear
    bookings_page.order_ride.click
    expect(bookings_page.destination_address.error_message).to eql("can't be blank")
    expect(bookings_page.name.error_message).to eql("can't be blank")
    expect(bookings_page.phone.error_message).to eql("can't be blank")

    with_headers do
      set_address_headers 'Kharkiv River'
      set_mock_header google_maps: { details: { country_code: nil } }
      bookings_page.destination_address.select('Kharkiv River')
      bookings_page.order_ride.click
      expect(bookings_page.destination_address.error_message).to eql("Sorry, this address is not supported by our system")
    end

    bookings_page.destination_address.select('221b Baker Street, London, UK')
    bookings_page.room.set('777')
    bookings_page.name.set('James Bond')
    bookings_page.phone.set('+44 7123 45678')
    bookings_page.message_to_driver.set('My name is Bond, James Bond!')
    bookings_page.order_ride.click

    expect(bookings_page.bookings_list).to have_bookings
    wait_until_true(timeout: 20) { bookings_page.bookings_list.bookings.first.text == '585 - Order received - James Bond, Room: 777' }
    bookings_page.bookings_list.bookings.first.title.click

    expect(bookings_page).to have_ride_details
    expect(bookings_page.ride_details).to have_status(text: 'Order received')
    expect(bookings_page.ride_details).to have_ride_type(text: 'BlackTaxi')
    expect(bookings_page.ride_details).to have_payment_method(text: 'Cash')
    expect(bookings_page.ride_details.pickup_time.text.in_time_zone('Europe/London')).to be_within(5.minutes).of(pre_book_time)
    expect(bookings_page.ride_details).to have_pickup_address(text: company.address.line)
    expect(bookings_page.ride_details).to have_destination_address(text: '221B Baker St, Marylebone, London NW1 6XE, UK')
    expect(bookings_page.ride_details).to have_name_and_phone(text: 'James Bond, Room: 777, +44 7123 45678')
    expect(bookings_page.ride_details).to have_message_to_driver(text: 'My name is Bond, James Bond!')

    bookings_page.ride_details.close_button.click
    bookings_page.wait_until_ride_details_invisible
  end
end
