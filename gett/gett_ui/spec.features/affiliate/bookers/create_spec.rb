require 'features_helper'

feature 'Affiliate New Booker' do
  let(:auth_page)             { Pages::Auth.login }
  let(:activate_account_page) { Pages::Auth.set_password }
  let(:bookers_page)          { Pages::Affiliate.bookers }
  let(:new_booker_page)       { Pages::Affiliate.new_booker }
  let(:bookings_page)         { Pages::Affiliate.bookings }
  let(:company)               { create(:company, :affiliate) }
  let(:booker)                { build(:booker) }

  feature ' - Admin can' do
    let(:user) { create(:admin, company: company) }
    include_examples 'create booker with role', 'Booker'
    include_examples 'create booker with role', 'Admin'
  end

  feature 'can not be created by' do
    include_examples 'booker can not be created by', 'Booker'
  end

  # Pending due to OU-2336
  xscenario 'should receive account activation link if Onboarding switched on' do
    login_to_affiliate_as(company.admin.email)
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
  end

  # Pending due to OU-2336
  xscenario 'should not be able to activate account if Active switched off' do
    login_to_affiliate_as(company.admin.email)
    new_booker_page.load

    new_booker_page.fill_in_form(booker)
    new_booker_page.active.click
    expect(new_booker_page.active).not_to be_checked
    new_booker_page.submit

    expect(bookers_page).to have_bookers(count: 1, text: booker.first_name)
    bookers_page.logout
    wait_until_true { auth_page.loaded? }

    activate_account_url = UITest.get_url_with_token_from_email(booker.email)
    visit activate_account_url

    wait_until_true { auth_page.loaded? }
    expect(auth_page.notification).to have_message(text: 'Password reset token invalid')
  end
end
