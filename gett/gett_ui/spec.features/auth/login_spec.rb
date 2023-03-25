require 'features_helper'

feature 'LogIn Page' do
  let(:auth_page)          { Pages::Auth.login }
  let(:new_booking_page)   { Pages::App.new_booking }
  let!(:company)           { create(:company) }
  let(:error_message_text) { 'The email or password you entered is incorrect.' }
  before { auth_page.load }

  scenario 'Empty email or password fields' do
    auth_page.login_as(' ', 'P@ssword')
    expect(auth_page.email.error_message).to eql("can't be blank")
    auth_page.refresh
    auth_page.login_as(company.admin.email, '')
    expect(auth_page.password.error_message).to eql('Please enter your password.')
  end

  feature 'Invalid fields' do
    scenario 'Invalid email with correct password' do
      auth_page.login_as('invalid@email.com', 'P@ssword')
      expect(auth_page).to have_error_message(text: error_message_text)
    end

    scenario 'Email Of User 1 And Pass Of User 2' do
      create(:booker, company: company, password: '123456', password_confirmation: '123456')
      auth_page.login_as(company.admin.email, '123456')
      expect(auth_page).to have_error_message(text: error_message_text)
    end
  end

  scenario 'Fields case sensitivity' do
    auth_page.login_as(company.admin.email, 'p@ssword')
    expect(auth_page).to have_error_message(text: error_message_text)

    auth_page.refresh
    auth_page.login_as(company.admin.email, 'P@SSWORD')
    expect(auth_page).to have_error_message(text: error_message_text)

    auth_page.login_as(company.admin.email.upcase, 'P@ssword')
    expect(new_booking_page).to be_loaded
  end

  feature 'Deactivated User' do
    let(:account_deactivated_message) { 'Your account has been deactivated' }

    scenario 'Company Admin' do
      company.admin.update(active: false)
      auth_page.login_as(company.admin.email)
      expect(auth_page).to have_error_message(text: account_deactivated_message)
    end

    scenario 'Booker' do
      booker = create(:booker, company: company, active: false)
      auth_page.login_as(booker.email)
      expect(auth_page).to have_error_message(text: account_deactivated_message)
    end
  end

  scenario 'Active User of Deactivated Company' do
    inactive_company = create(:company, :inactive)
    auth_page.login_as(inactive_company.admin.email)
    expect(auth_page).to have_error_message(text: 'Your company account has been deactivated')
  end

  scenario 'Terms, Privacy And Contact Links' do
    privacy_policy_page = Pages::Auth.privacy_policy
    terms_and_conditions_page = Pages::Auth.terms_and_conditions

    click_link 'Terms & Conditions'
    expect(terms_and_conditions_page).to be_loaded
    auth_page.load

    click_link 'Privacy Policy'
    expect(privacy_policy_page).to be_loaded
    auth_page.load

    contact_us_link = find(:link, 'Contact Us')
    expect(contact_us_link["href"]).to eql('https://gett.com/uk/contact-gbs/')
  end
end
