require 'features_helper'

feature 'Affiliate Edit Booker' do
  let(:auth_page)        { Pages::Auth.login }
  let(:bookers_page)     { Pages::Affiliate.bookers }
  let(:edit_booker_page) { Pages::Affiliate.edit_booker }
  let(:company)          { create(:company, :affiliate) }

  feature 'Booker' do
    let(:user) { create(:booker, company: company) }
    include_examples "edit self booker's profile"
  end

  feature 'Admin' do
    let(:user) { create(:admin, company: company) }
    include_examples "edit self booker's profile"
    include_examples "edit profile for booker"
  end

  scenario 'deactivated booker can not sign in' do
    booker = create(:booker, company: company)
    login_to_affiliate_as(company.admin.email)
    edit_booker_page.load(id: booker.id)

    edit_booker_page.active.click
    edit_booker_page.submit

    wait_until_true { bookers_page.loaded? }
    bookers_page.logout

    wait_until_true { auth_page.loaded? }
    auth_page.login_as(booker.email)
    expect(auth_page).to have_error_message(text: 'Your account has been deactivated')
  end

  scenario 'Send mail with activation account link using ReInvite button' do
    booker = create(:booker, :onboarding, company: company)
    activate_account_page = Pages::Auth.set_password
    bookings_page = Pages::Affiliate.bookings
    new_password = 'P!ssword'

    login_to_affiliate_as(company.admin.email)
    edit_booker_page.load(id: booker.id)
    edit_booker_page.reinvite_button.click
    edit_booker_page.cancel_button.click
    bookers_page.logout
    wait_until_true { auth_page.loaded? }

    activate_account_url = UITest.get_url_with_token_from_email(booker.email)
    visit activate_account_url
    wait_until_true { activate_account_page.loaded? }
    activate_account_page.password.set(new_password)
    activate_account_page.password_confirmation.set(new_password)
    activate_account_page.set_password_button.click
    wait_until_true { bookings_page.loaded? }
  end
end
