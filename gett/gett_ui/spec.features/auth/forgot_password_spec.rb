require 'features_helper'

feature 'Forgot Password Page' do
  let(:auth_page)              { Pages::Auth.login }
  let(:forgot_password_page)   { Pages::Auth.forgot_password }
  let(:reset_password_page)    { Pages::Auth.reset_password }
  let(:new_booking_page)       { Pages::App.new_booking }
  let!(:company)               { create(:company) }
  let(:instructions_sent_text) { "We've sent you an email with instructions on how to reset your password. Please check your inbox and follow link in the email." }

  before { forgot_password_page.load }

  scenario 'Reset password for existed member' do
    submit_reset_password_form(company.admin.email)
    reset_password_link = UITest.get_url_with_token_from_email(company.admin.email)
    visit reset_password_link
    wait_until_true { reset_password_page.loaded? }

    password = 'P!ssword'
    reset_password_page.password.set(password)
    reset_password_page.password_confirmation.set(password)
    reset_password_page.set_password_button.click

    wait_until_true { new_booking_page.loaded? }
    new_booking_page.logout

    wait_until_true { auth_page.loaded? }
    login_as(company.admin.email, password)
    wait_until_true { new_booking_page.loaded? }
  end

  scenario 'Empty or invalid email' do
    forgot_password_page.reset_password_for('')
    expect(forgot_password_page.email.error_message).to eql("can't be blank")

    forgot_password_page.reset_password_for('invalid_email.com')
    expect(forgot_password_page.email.error_message).to eql('Email is not valid')
  end

  scenario 'Email field should not be case sensivity' do
    submit_reset_password_form(company.admin.email.upcase)
    expect(UITest.get_url_with_token_from_email(company.admin.email)).to be_present
  end

  feature 'Email should not be sent', priority: :low do
    scenario 'for inactive user' do
      company.admin.update(active: false)
      submit_reset_password_form(company.admin.email)
      expect(UITest.email_file(company.admin.email)).not_to be_present
    end

    scenario 'for active user of inactive company' do
      inactive_company = create(:company, :inactive)
      submit_reset_password_form(inactive_company.admin.email)
      expect(UITest.email_file(inactive_company.admin.email)).not_to be_present
    end
  end

  def submit_reset_password_form(email)
    forgot_password_page.reset_password_for(email)
    expect(auth_page).to be_loaded
    expect(auth_page).to have_notification(text: instructions_sent_text)
  end
end
