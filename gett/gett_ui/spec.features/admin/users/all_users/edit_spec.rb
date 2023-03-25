require 'features_helper'

feature 'Edit Member', priority: :low do
  let(:auth_page)      { Pages::Auth.login }
  let(:users_page)     { Pages::Admin.all_users }
  let(:edit_user_page) { Pages::Admin.edit_user }
  let!(:company)       { create(:company, :enterprise) }

  feature 'with role Booker' do
    let!(:member) { create(:booker, company: company) }
    include_examples 'edit profile for member'
  end

  feature 'with role Passenger for Enterprise Company' do
    let!(:member) { create(:passenger, company: company) }
    include_examples 'edit profile for member'
  end

  feature 'with role Booker for Affiliate Company' do
    let(:company) { create(:company, :affiliate) }
    let!(:member) { create(:booker, company: company) }
    include_examples 'edit profile for member'
  end

  feature 'for BackOffice user with existing FrontOffice role' do
    let!(:member) { create(:booker, company: company, user_role: Role.find(name: 'admin')) }
    include_examples 'edit profile for member'
  end

  scenario 'role should no be changed for Company Admin' do
    login_as_super_admin
    users_page.load

    user_record = users_page.get_user_by_email(company.admin.email)
    user_record.actions.click
    user_record.wait_until_actions_menu_visible
    user_record.actions_menu.edit.click
    wait_until_true { edit_user_page.loaded? }

    edit_user_page.role.select('Booker')
    edit_user_page.submit

    wait_until_true { users_page.loaded? }
    user_record = users_page.get_user_by_email(company.admin.email)
    expect(user_record.role).to eql('Admin')
  end

  feature 'Send mail with activation account link' do
    let(:passenger)             { create(:passenger, company: company) }
    let(:activate_account_page) { Pages::Auth.set_password }
    let(:new_booking_page)      { Pages::App.new_booking }
    let(:new_password)          { 'P!ssword' }

    before do
      login_as_super_admin
      edit_user_page.load(id: passenger.id)
    end

    scenario 'using OnBoarding switcher' do
      edit_user_page.onboarding.click
      expect(edit_user_page.onboarding).to be_checked
      edit_user_page.submit

      users_page.logout
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

      login_as_super_admin
      edit_user_page.load(id: passenger.id)
      expect(edit_user_page).to have_no_onboarding
      expect(edit_user_page).to have_text('Onboarded')
    end

    scenario 'using ReInvite button' do
      edit_user_page.reinvite_button.click
      edit_user_page.cancel_button.click

      users_page.logout
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

  scenario 'deactivated passenger can not sign in' do
    passenger = create(:passenger, company: company)
    login_as_super_admin
    edit_user_page.load(id: passenger.id)

    edit_user_page.active.click
    edit_user_page.submit

    wait_until_true { users_page.loaded? }
    users_page.logout

    wait_until_true { auth_page.loaded? }
    auth_page.login_as(passenger.email)
    expect(auth_page).to have_error_message(text: 'Your account has been deactivated')
  end

  feature 'Payment Card' do
    let(:passenger) { create(:passenger, company: company) }
    let!(:existed_payment_card) { create(:payment_card, :business, passenger: passenger) }

    before do
      login_as_super_admin
      edit_user_page.load(id: passenger.id)
      edit_user_page.payment_cards_tab.click
      expect(edit_user_page).to have_payment_card(count: 1)
    end

    scenario 'deactivate' do
      record = edit_user_page.first_business_card
      record.actions.deactivate_button.click
      edit_user_page.delete_modal.ok_button.click
      expect(edit_user_page).to have_text("You haven't added any credit cards yet.")
    end

    scenario 'make default' do
      record = edit_user_page.first_business_card
      expect(record).not_to be_default
      record.make_default
      expect(record.actions).to have_no_deactivate_button
      expect(record).to be_default
    end
  end
end
