require 'features_helper'

feature 'Passenger - Advanced Options' do
  let(:passengers_page)      { Pages::App.passengers }
  let(:edit_passenger_page)  { Pages::App.edit_passenger }
  let(:new_booking_page)     { Pages::App.new_booking }
  let(:company)              { create(:company, :enterprise) }
  let(:passenger)            { create(:passenger, company: company) }
  let(:baker_street_address) { '221b Baker Street, London, UK' }

  scenario 'Set default taxi type' do
    login_to_app_as(passenger.email)
    edit_passenger_page.load(id: passenger.id)
    wait_until_true do
      edit_passenger_page.advanced_options_tab.click
      break true if edit_passenger_page.has_default_car_type_selector?
    end
    expect(edit_passenger_page).to have_default_car_type_selector
    edit_passenger_page.select_default_car_type(:black_taxi_xl)
    expect(edit_passenger_page.default_car_type_selector.black_taxi_xl).to be_checked

    new_booking_page.load
    new_booking_page.destination_address.select baker_street_address
    new_booking_page.vehicles.wait_until_available
    expect(new_booking_page.vehicles.black_taxi_xl).to be_selected
  end
end
