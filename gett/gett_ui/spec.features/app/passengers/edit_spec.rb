require 'features_helper'

feature 'Edit Passenger' do
  let(:auth_page)           { Pages::Auth.login }
  let(:passengers_page)     { Pages::App.passengers }
  let(:edit_passenger_page) { Pages::App.edit_passenger }
  let(:bookers_page)        { Pages::App.bookers }
  let(:edit_booker_page)    { Pages::App.edit_booker }
  let(:company)             { create(:company, :enterprise) }
  let(:departments)         { create_list(:department, 2, company: company) }
  let(:work_roles)          { create_list(:work_role, 2, company: company) }

  feature 'Passenger', priority: :low do
    let(:user) { create(:passenger, company: company) }
    include_examples "edit self passenger's profile"
  end

  context 'low priority', priority: :low do
    feature 'Booker' do
      let(:user) { create(:booker, company: company) }
      include_examples "edit self passenger's profile"
      context 'managed passengers' do
        let(:user) { create(:booker, company: company, passenger_pks: [passenger.id]) }
        include_examples "edit profile for passenger"
        let(:manage_user) { true }
      end
    end

    feature 'Finance', priority: :low do
      let(:user) { create(:finance, company: company) }
      include_examples "edit self passenger's profile"
      include_examples "edit profile for passenger"
    end

    feature 'Travel Manager', priority: :low do
      let(:user) { create(:travelmanager, company: company) }
      include_examples "edit self passenger's profile"
      include_examples "edit profile for passenger"
    end

    feature 'Admin' do
      let(:user) { create(:admin, company: company) }
      include_examples "edit self passenger's profile"
      include_examples "edit profile for passenger"
    end
  end

  feature 'Company Admin', priority: :low do
    let(:user) { company.admin }
    include_examples "edit self passenger's profile"
    include_examples "edit profile for passenger"
  end

  scenario 'deactivated passenger can not sign in' do
    passenger = create(:passenger, company: company)
    login_to_app_as(company.admin.email)
    edit_passenger_page.load(id: passenger.id)

    edit_passenger_page.active.click
    edit_passenger_page.submit

    wait_until_true { passengers_page.loaded? }
    passengers_page.logout

    wait_until_true { auth_page.loaded? }
    auth_page.login_as(passenger.email)
    expect(auth_page).to have_error_message(text: 'Your account has been deactivated')
  end

  scenario 'cancel saving changes' do
    fake_passenger = build(:passenger)
    login_to_app_as(company.admin.email)
    edit_passenger_page.load(id: company.admin.id)

    edit_passenger_page.fill_in_form(fake_passenger)
    edit_passenger_page.cancel_button.click
    wait_until_true { passengers_page.loaded? }
    expect(passengers_page).to have_passengers(count: 1, text: company.admin.full_name)
  end

  feature 'Change role' do
    let(:passenger) { create(:passenger, company: company) }
    let(:booker)    { create(:booker, company: company) }

    scenario 'from passenger to booker' do
      passenger.add_booker(booker)

      login_to_app_as(company.admin.email)
      edit_passenger_page.load(id: passenger.id)

      expect(edit_passenger_page.bookers.selected_options).to eql([booker.full_name])
      edit_passenger_page.role.select 'Booker'
      edit_passenger_page.submit

      wait_until_true { passengers_page.loaded? }
      edit_passenger_page.load(id: passenger.id)
      expect(edit_passenger_page.role.selected_options).to eql('Booker')
      expect(edit_passenger_page.bookers.selected_options).to eql([booker.full_name])

      bookers_page.load
      expect(bookers_page).to have_bookers(text: passenger.email)
    end

    scenario 'from booker to passenger - should unassign all passengers' do
      booker.add_passenger(passenger)
      booker.add_booker(company.admin)

      login_to_app_as(company.admin.email)

      edit_passenger_page.load(id: passenger.id)
      expect(edit_passenger_page.bookers.selected_options).to eql([booker.full_name])

      edit_passenger_page.load(id: booker.id)
      expect(edit_passenger_page.bookers.selected_options).to eql([company.admin.full_name])
      edit_passenger_page.role.select('Passenger')
      expect(edit_passenger_page.warning).to have_description(text: 'Changing role of this user will unassign them from all passengers')
      edit_passenger_page.submit

      wait_until_true { passengers_page.loaded? }
      edit_passenger_page.load(id: booker.id)
      expect(edit_passenger_page.role.selected_options).to eql('Passenger')
      expect(edit_passenger_page.bookers.selected_options).to eql([company.admin.full_name])

      edit_passenger_page.load(id: passenger.id)
      expect(edit_passenger_page.bookers.selected_options).to be_blank

      bookers_page.load
      expect(bookers_page).to have_no_bookers(text: passenger.email)
    end
  end

  feature 'Send mail with activation account link' do
    let(:passenger)             { create(:passenger, company: company) }
    let(:booker)                { create(:booker, company: company) }
    let(:activate_account_page) { Pages::Auth.set_password }
    let(:new_booking_page)      { Pages::App.new_booking }
    let(:new_password)          { 'P!ssword' }

    before do
      login_to_app_as(booker.email)
      edit_passenger_page.load(id: passenger.id)
    end

    scenario 'using OnBoarding switcher' do
      edit_passenger_page.onboarding.click
      expect(edit_passenger_page.onboarding).to be_checked
      edit_passenger_page.submit

      passengers_page.logout
      wait_until_true { auth_page.loaded? }

      activate_account_url = UITest.get_url_with_token_from_email(passenger.email)
      visit activate_account_url
      wait_until_true { activate_account_page.loaded? }

      activate_account_page.password.set(new_password)
      activate_account_page.password_confirmation.set(new_password)
      activate_account_page.set_password_button.click

      wait_until_true { new_booking_page.loaded? }
      expect(new_booking_page).to have_welcome_modal
      new_booking_page.welcome_modal.close
      new_booking_page.logout

      login_to_app_as(booker.email)
      edit_passenger_page.load(id: passenger.id)
      expect(edit_passenger_page).to have_no_onboarding
      expect(edit_passenger_page).to have_text('Onboarded')
    end

    scenario 'using ReInvite button' do
      edit_passenger_page.reinvite_button.click
      edit_passenger_page.cancel_button.click

      passengers_page.logout
      wait_until_true { auth_page.loaded? }

      activate_account_url = UITest.get_url_with_token_from_email(passenger.email)
      visit activate_account_url
      wait_until_true { activate_account_page.loaded? }

      activate_account_page.password.set(new_password)
      activate_account_page.password_confirmation.set(new_password)
      activate_account_page.set_password_button.click

      wait_until_true { new_booking_page.loaded? }
      expect(new_booking_page).to have_no_welcome_modal
    end
  end
end
