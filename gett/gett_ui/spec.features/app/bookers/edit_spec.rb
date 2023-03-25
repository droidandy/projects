require 'features_helper'

feature 'Edit Booker' do
  let(:auth_page)        { Pages::Auth.login }
  let(:bookers_page)     { Pages::App.bookers }
  let(:edit_booker_page) { Pages::App.edit_booker }
  let(:company)          { create(:company, :enterprise) }
  let(:departments)      { create_list(:department, 2, company: company) }
  let(:work_roles)       { create_list(:work_role, 2, company: company) }

  feature 'Company Admin' do
    let(:user) { company.admin }
    include_examples "edit self booker's profile"
    include_examples "edit profile for booker"
  end

  context 'low priority', priority: :low do
    feature 'Booker' do
      let(:user) { create(:booker, company: company) }
      include_examples "edit self booker's profile"
    end

    feature 'Finance' do
      let(:user) { create(:finance, company: company) }
      include_examples "edit self booker's profile"
    end

    feature 'Travel Manager' do
      let(:user) { create(:travelmanager, company: company) }
      include_examples "edit self booker's profile"
      include_examples "edit profile for booker"
    end

    feature 'Admin' do
      let(:user) { create(:admin, company: company) }
      include_examples "edit self booker's profile"
      include_examples "edit profile for booker"
    end
  end

  scenario 'deactivated booker can not sign in' do
    booker = create(:booker, company: company)
    login_to_app_as(company.admin.email)
    edit_booker_page.load(id: booker.id)

    edit_booker_page.active.click
    edit_booker_page.submit

    wait_until_true { bookers_page.loaded? }
    bookers_page.logout

    wait_until_true { auth_page.loaded? }
    auth_page.login_as(booker.email)
    expect(auth_page).to have_error_message(text: 'Your account has been deactivated')
  end

  feature 'Send mail with activation account link' do
    let!(:booker)               { create(:booker, :onboarding, company: company) }
    let(:activate_account_page) { Pages::Auth.set_password }
    let(:new_booking_page)      { Pages::App.new_booking }
    let(:new_password)          { 'P!ssword' }

    scenario 'using OnBoarding switcher' do
      login_to_app_as(company.admin.email)
      edit_booker_page.load(id: booker.id)

      edit_booker_page.onboarding.click
      expect(edit_booker_page.onboarding).to be_checked
      edit_booker_page.submit

      bookers_page.logout
      wait_until_true { auth_page.loaded? }

      activate_account_url = UITest.get_url_with_token_from_email(booker.email)
      visit activate_account_url
      wait_until_true { activate_account_page.loaded? }

      activate_account_page.password.set(new_password)
      activate_account_page.password_confirmation.set(new_password)
      activate_account_page.set_password_button.click

      wait_until_true { new_booking_page.loaded? }
      expect(new_booking_page).to have_welcome_modal
      new_booking_page.welcome_modal.close
      new_booking_page.logout

      login_to_app_as(company.admin.email)
      edit_booker_page.load(id: booker.id)
      expect(edit_booker_page).to have_no_onboarding
      expect(edit_booker_page).to have_text('Onboarded')
    end

    scenario 'using ReInvite button' do
      login_to_app_as(company.admin.email)
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

      wait_until_true { new_booking_page.loaded? }
      expect(new_booking_page).to have_no_welcome_modal
    end
  end

  scenario 'cancel saving form', priority: :low do
    fake_booker = build(:booker)
    login_to_app_as(company.admin.email)
    edit_booker_page.load(id: company.admin.id)
    edit_booker_page.fill_in_form(fake_booker)
    edit_booker_page.cancel_button.click
    wait_until_true { bookers_page.loaded? }
    expect(bookers_page).to have_bookers(count: 1, text: company.admin.full_name)
  end
end
