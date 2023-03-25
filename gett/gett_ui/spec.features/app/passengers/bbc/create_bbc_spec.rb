require 'features_helper'

feature 'New BBC Passenger' do
  let(:auth_page)             { Pages::Auth.login }
  let(:activate_account_page) { Pages::Auth.set_password }
  let(:new_booking_page)      { Pages::App.new_booking }
  let(:passengers_page)       { Pages::App.passengers }
  let(:new_passenger_page)    { Pages::App.new_passenger }
  let(:edit_passenger_page)   { Pages::App.edit_passenger }
  let(:company)               { create(:company, :bbc) }
  let(:passenger)             { build(:passenger) }

  feature 'Company Admin can' do
    let(:user) { company.admin }
    include_examples 'create bbc passenger with category', 'Freelancer'
    include_examples 'create bbc passenger with category', 'ThinPD'
    include_examples 'create bbc passenger with category', 'FullPD'
  end

  context 'low priority', priority: :low do
    feature 'Admin Can' do
      let(:user) { create(:admin, company: company) }
      include_examples 'create bbc passenger with category', 'Freelancer'
      include_examples 'create bbc passenger with category', 'ThinPD'
      include_examples 'create bbc passenger with category', 'FullPD'
    end

    feature 'Travel Manager can' do
      let(:user) { create(:travelmanager, company: company) }
      include_examples 'create bbc passenger with category', 'Freelancer'
      include_examples 'create bbc passenger with category', 'ThinPD'
      include_examples 'create bbc passenger with category', 'FullPD'
    end
  end

  feature 'can not be created' do
    include_examples 'bbc passenger can not be created by', 'Passenger'
    include_examples 'bbc passenger can not be created by', 'Booker'
    include_examples 'bbc passenger can not be created by', 'Finance'
  end

  scenario 'should receive account activation link if Onboarding switched on' do
    login_to_app_as(company.admin.email)
    new_passenger_page.load

    new_passenger_page.fill_in_form(passenger)
    new_passenger_page.passenger_categorisation.select('Freelancer')
    new_passenger_page.onboarding.click
    expect(new_passenger_page.onboarding).to be_checked
    new_passenger_page.submit

    wait_until_true { passengers_page.passengers.present? }

    expect(passengers_page).to have_passengers(count: 1, text: passenger.first_name)
    passengers_page.logout
    wait_until_true { auth_page.loaded? }

    activate_account_url = UITest.get_url_with_token_from_email(passenger.email)
    visit activate_account_url
    wait_until_true { activate_account_page.loaded? }

    password = 'P!ssword'
    activate_account_page.password.set password
    activate_account_page.password_confirmation.set password
    activate_account_page.set_password_button.click

    wait_until_true { new_booking_page.loaded? }
    expect(new_booking_page).to have_welcome_modal
    new_booking_page.welcome_modal.close
    new_booking_page.logout

    wait_until_true { auth_page.loaded? }
    login_as(passenger.email, password)
    wait_until_true { new_booking_page.loaded? }
    expect(new_booking_page).to have_no_welcome_modal
  end

  scenario 'should not be able to activate account if Active switched off' do
    login_to_app_as(company.admin.email)
    new_passenger_page.load

    new_passenger_page.fill_in_form(passenger)
    new_passenger_page.passenger_categorisation.select('Staff')
    new_passenger_page.active.click
    expect(new_passenger_page.active).not_to be_checked
    new_passenger_page.onboarding.click
    expect(new_passenger_page.onboarding).to be_checked
    new_passenger_page.submit

    expect(passengers_page).to have_passengers(count: 1, text: passenger.first_name)
    passengers_page.logout
    wait_until_true { auth_page.loaded? }

    activate_account_url = UITest.get_url_with_token_from_email(passenger.email)
    visit activate_account_url

    wait_until_true { auth_page.loaded? }
    expect(auth_page.notification).to have_message(text: 'Password reset token invalid')
  end
end
