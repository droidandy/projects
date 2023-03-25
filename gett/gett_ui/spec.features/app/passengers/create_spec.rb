require 'features_helper'

feature 'New Passenger' do
  let(:auth_page)             { Pages::Auth.login }
  let(:activate_account_page) { Pages::Auth.set_password }
  let(:passengers_page)       { Pages::App.passengers }
  let(:new_passenger_page)    { Pages::App.new_passenger }
  let(:edit_passenger_page)   { Pages::App.edit_passenger }
  let(:bookers_page)          { Pages::App.bookers }
  let(:new_booking_page)      { Pages::App.new_booking }
  let(:new_company_page)      { Pages::Admin.new_company }
  let(:companies_page)        { Pages::Admin.companies }
  let(:company)               { create(:company, :enterprise) }
  let(:passenger)             { build(:passenger) }
  let(:admin)                 { create(:admin, company: company) }
  let(:tm)                    { create(:travelmanager, company: company) }

  feature ' - Company Admin can' do
    let(:user) { company.admin }
    include_examples 'create passenger with role', 'Passenger'
  end

  context 'low priority', priority: :low do
    feature ' - Company Admin can' do
      let(:user) { company.admin }
      include_examples 'create passenger with role', 'Booker'
      include_examples 'create passenger with role', 'Finance'
      include_examples 'create passenger with role', 'Travel Manager'
      include_examples 'create passenger with role', 'Admin'
    end

    feature ' - Admin can' do
      let(:user) { admin }
      include_examples 'create passenger with role', 'Passenger'
      include_examples 'create passenger with role', 'Booker'
      include_examples 'create passenger with role', 'Finance'
      include_examples 'create passenger with role', 'Travel Manager'
      include_examples 'create passenger with role', 'Admin'
    end

    feature ' - Travel Manager can' do
      let(:user) { tm }
      include_examples 'create passenger with role', 'Passenger'
      include_examples 'create passenger with role', 'Booker'
      include_examples 'create passenger with role', 'Finance'
      include_examples 'create passenger with role', 'Travel Manager'
      include_examples 'create passenger with role', 'Admin'
    end
  end

  feature 'can not be created' do
    include_examples 'passenger can not be created by', 'Passenger'
    include_examples 'passenger can not be created by', 'Booker'
    include_examples 'passenger can not be created by', 'Finance'
  end

  scenario 'cancel saving form' do
    login_to_app_as(company.admin.email)
    passengers_page.load
    passengers_page.new_passenger_button.click
    wait_until_true { new_passenger_page.loaded? }
    new_passenger_page.fill_in_form passenger
    new_passenger_page.cancel_button.click
    wait_until_true { passengers_page.loaded? }
    expect(passengers_page).to have_passengers(count: 1)
  end

  scenario 'should receive account activation link if Onboarding switched on' do
    login_to_app_as(company.admin.email)
    new_passenger_page.load

    new_passenger_page.fill_in_form passenger
    new_passenger_page.onboarding.click
    expect(new_passenger_page.onboarding).to be_checked
    new_passenger_page.submit
    wait_until_true { passengers_page.loaded? }
    expect(passengers_page).to have_passengers(count: 1, text: passenger.first_name)
    passengers_page.logout
    wait_until_true { auth_page.loaded? }

    activate_account_url = UITest.get_url_with_token_from_email(passenger.email)
    visit activate_account_url
    wait_until_true { activate_account_page.loaded? }

    password = 'P!ssword'
    activate_account_page.password.set(password)
    activate_account_page.password_confirmation.set(password)
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

    new_passenger_page.fill_in_form passenger
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

  scenario 'require Payroll ID and Cost Centre if it is enabled for company' do
    admin = build(:member)

    auth_page.login_as_super_admin
    new_company_page.load

    new_company_page.fill_in_ent_form(Faker::Company.name, admin)
    expect(new_company_page).to have_gett_id_verify_button(disabled: true, text: 'Verified')
    expect(new_company_page).to have_ot_verify_button(disabled: true, text: 'Verified')

    new_company_page.mandatory_payroll_id.click
    new_company_page.mandatory_payroll_cost_centre.click
    new_company_page.submit

    wait_until_true { companies_page.loaded? }
    expect(companies_page).to have_companies
    companies_page.logout

    login_to_app_as(admin.email)
    new_passenger_page.load

    new_passenger_page.fill_in_form passenger
    new_passenger_page.submit
    expect(new_passenger_page.payroll_id.error_message).to eql("can't be blank")
    expect(new_passenger_page.cost_centre.error_message).to eql("can't be blank")

    new_passenger_page.payroll_id.set('RequiredPayrollID')
    new_passenger_page.cost_centre.set('RequiredCostCentre')
    new_passenger_page.save_button.click

    wait_until_true { passengers_page.passengers.present? }

    expect(passengers_page).to have_passengers(count: 1, text: passenger.first_name)
  end
end
