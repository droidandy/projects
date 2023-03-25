require 'features_helper'

feature 'New Booker' do
  let(:auth_page)             { Pages::Auth.login }
  let(:activate_account_page) { Pages::Auth.set_password }
  let(:bookers_page)          { Pages::App.bookers }
  let(:new_booker_page)       { Pages::App.new_booker }
  let(:passengers_page)       { Pages::App.passengers }
  let(:edit_passenger_page)   { Pages::App.edit_passenger }
  let(:new_booking_page)      { Pages::App.new_booking }
  let(:company)               { create(:company, :enterprise) }
  let(:booker)                { build(:booker) }

  feature ' - Company Admin can' do
    let(:user) { company.admin }
    include_examples 'create booker with role', 'Booker'
  end

  context 'low priority', priority: :low do
    feature ' - Company Admin can' do
      let(:user) { company.admin }
      include_examples 'create booker with role', 'Finance'
      include_examples 'create booker with role', 'Travel Manager'
      include_examples 'create booker with role', 'Admin'
    end

    feature ' - Admin can' do
      let(:user) { create(:admin, company: company) }
      include_examples 'create booker with role', 'Booker'
      include_examples 'create booker with role', 'Finance'
      include_examples 'create booker with role', 'Travel Manager'
      include_examples 'create booker with role', 'Admin'
    end

    feature ' - Travel Manager can' do
      let(:user) { create(:travelmanager, company: company) }
      include_examples 'create booker with role', 'Booker'
      include_examples 'create booker with role', 'Finance'
      include_examples 'create booker with role', 'Travel Manager'
      include_examples 'create booker with role', 'Admin'
    end

    feature 'can not be created by' do
      include_examples 'booker can not be created by', 'Booker'
      include_examples 'booker can not be created by', 'Finance'
    end
  end

  scenario 'should receive account activation link if Onboarding switched on' do
    login_to_app_as(company.admin.email)
    new_booker_page.load

    new_booker_page.fill_in_form(booker)
    new_booker_page.onboarding.click
    expect(new_booker_page.onboarding).to be_checked
    new_booker_page.submit

    expect(bookers_page).to have_bookers(count: 1, text: booker.first_name)
    bookers_page.logout
    wait_until_true { auth_page.loaded? }

    activate_account_url = UITest.get_url_with_token_from_email(booker.email)
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
  end

  scenario 'should not be able to activate account if Active switched off' do
    login_to_app_as(company.admin.email)
    new_booker_page.load

    new_booker_page.fill_in_form(booker)
    new_booker_page.active.click
    expect(new_booker_page.active).not_to be_checked
    new_booker_page.onboarding.click
    expect(new_booker_page.onboarding).to be_checked
    new_booker_page.submit

    expect(bookers_page).to have_bookers(count: 1, text: booker.first_name)
    bookers_page.logout
    wait_until_true { auth_page.loaded? }

    activate_account_url = UITest.get_url_with_token_from_email(booker.email)
    visit activate_account_url

    wait_until_true { auth_page.loaded? }
    expect(auth_page.notification).to have_message(text: 'Password reset token invalid')
  end

  scenario 'cancel saving form', priority: :low do
    login_to_app_as(company.admin.email)
    bookers_page.load
    bookers_page.new_booker_button.click
    wait_until_true { new_booker_page.loaded? }
    new_booker_page.fill_in_form(booker)
    new_booker_page.cancel_button.click
    wait_until_true { bookers_page.loaded? }
    expect(bookers_page).to have_bookers(count: 1)
  end
end
