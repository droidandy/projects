require 'features_helper'

feature 'New Booking - International Rides' do
  let(:new_booking_page) { Pages::App.new_booking }
  let(:bookings_page)    { Pages::App.bookings }
  let(:company)          { create(:company, :enterprise) }
  let(:pickup_address)   { '196 Rue Turenne, 33000 Bordeaux, France' }

  scenario 'Display International Price and disable Stop Points' do
    login_to_app_as(company.admin.email)
    expect(new_booking_page).to be_displayed

    new_booking_page.i_am_passenger.click
    expect(new_booking_page).to have_add_stop_point
    new_booking_page.international.click
    expect(new_booking_page).to have_no_add_stop_point(wait: 1)

    with_headers do
      set_address_headers pickup_address
      set_mock_header google_maps: { details: { country_code: 'FR' } }
      new_booking_page.pickup_address.select(pickup_address)
    end

    with_headers do
      set_address_headers company.address.line
      new_booking_page.destination_address.select(company.address.line)
    end

    new_booking_page.vehicles.wait_until_available
    expect(new_booking_page.vehicles.available_cars_list).to include('Standard')

    new_booking_page.vehicles.standard.click
    expect(new_booking_page.vehicles.description).to have_price(text: /£\d+\.\d+\* €\d+\.\d+/)
  end

  scenario 'No cars should be available for As Directed ride' do
    login_to_app_as(company.admin.email)
    expect(new_booking_page).to be_displayed

    new_booking_page.i_am_passenger.click
    new_booking_page.international.click
    new_booking_page.as_directed.click

    with_headers do
      set_address_headers pickup_address
      set_mock_header google_maps: { details: { country_code: 'FR' } }
      new_booking_page.pickup_address.select(pickup_address)
    end

    expect(new_booking_page.vehicles).to be_cars_loaded
    expect(new_booking_page.vehicles.available_cars_list).to be_blank
  end
end
