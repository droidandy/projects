require 'features_helper'

feature 'Company' do
  let(:auth_page)         { Pages::Auth.login }
  let(:new_company_page)  { Pages::Admin.new_company }
  let(:edit_company_page) { Pages::Admin.edit_company }
  let(:companies_page)    { Pages::Admin.companies }
  let(:new_company_name)  { Faker::Company.name }
  let(:super_admin_name)  { UITest.super_admin.full_name }
  let(:driver_message)    { Faker::Lorem.characters(110) }
  let(:account_number)    { Faker::Number.number(9) }
  let(:sort_code)         { Faker::Number.number(7) }
  let(:admin)             { build(:member) }
  let!(:gett_users)       { [create(:user, :sales), create(:user, :customer_care), create(:user, :outsourced_customer_care), UITest.super_admin].map(&:full_name) }
  let!(:company)          { create(:company, :affiliate) }

  before { login_as_super_admin }

  scenario 'Create' do
    new_company_page.load
    new_company_page.company_type.select('Affiliate')

    # Verify required fields
    new_company_page.submit
    expect(new_company_page.company_name.error_message).to eql("can't be blank")
    expect(new_company_page.address.error_message).to eql("Address not found. Please check the address entered.")
    expect(new_company_page.first_name.error_message).to eql("can't be blank")
    expect(new_company_page.second_name.error_message).to eql("can't be blank")
    expect(new_company_page.phone_number.error_message).to eql("can't be blank")
    expect(new_company_page.email.error_message).to eql("can't be blank")
    expect(new_company_page.password.error_message).to eql("can't be blank")
    expect(new_company_page.confirm_password.error_message).to eql("can't be blank")
    expect(new_company_page.gett_id.error_message).to eql("can't be blank")

    # Verify that Enterprise/BBC fields are not displayed
    expect(new_company_page).to have_no_default_payment_type
    expect(new_company_page).to have_no_booking_fee
    expect(new_company_page).to have_no_handling_fee
    expect(new_company_page).to have_no_invoicing_schedule
    expect(new_company_page).to have_no_run_in_fee
    expect(new_company_page).to have_no_phone_booking_fee
    expect(new_company_page).to have_no_splyt_invoice
    expect(new_company_page).to have_no_tips
    expect(new_company_page).to have_no_business_credit
    expect(new_company_page).to have_no_payment_terms
    expect(new_company_page).to have_no_gett_cancellation_before_arrival_fee
    expect(new_company_page).to have_no_gett_cancellation_after_arrival_fee
    expect(new_company_page).to have_no_gett_e_cancellation_before_arrival_fee
    expect(new_company_page).to have_no_gett_e_cancellation_after_arrival_fee
    expect(new_company_page).to have_no_ot_cancellation_before_arrival_fee
    expect(new_company_page).to have_no_ot_cancellation_after_arrival_fee
    expect(new_company_page).to have_no_quote_price_increase_percentage
    expect(new_company_page).to have_no_quote_price_increase_pounds
    expect(new_company_page).to have_no_international_booking_fee
    expect(new_company_page).to have_no_additional_billing_recipients
    expect(new_company_page).to have_no_company_registration_number
    expect(new_company_page).to have_no_incorporated_at

    expect(new_company_page).to have_no_travel_policy_mileage_limit
    expect(new_company_page).to have_no_hw_deviation_distance
    expect(new_company_page).to have_no_p11d_percentage
    expect(new_company_page).to have_no_excess_cost_per_mile

    expect(new_company_page).to have_no_bookings_validation
    expect(new_company_page).to have_no_api_key
    expect(new_company_page).to have_no_multiple_booking
    expect(new_company_page).to have_no_booker_notifications
    expect(new_company_page).to have_no_mandatory_payroll_id
    expect(new_company_page).to have_no_mandatory_payroll_cost_centre
    expect(new_company_page).to have_no_hr_feed_enabled
    expect(new_company_page).to have_no_allow_preferred_vendor
    expect(new_company_page).to have_no_default_booker_notifications_emails

    expect(new_company_page).to have_no_customer_care_password_active
    expect(new_company_page).to have_no_customer_care_password

    expect(new_company_page).to have_no_on_boarding
    expect(new_company_page).to have_no_ot_username
    expect(new_company_page).to have_no_ot_client_number

    expect(new_company_page).to have_no_references

    expect(new_company_page.payment_types.available_options).to be_blank
    expect(new_company_page.payment_types.selected_options).to eql(['Cash'])

    new_company_page.company_name.set(new_company_name)
    new_company_page.address.select('221b Baker Street, London, UK')

    new_company_page.vat_number.set(123)
    new_company_page.account_number.set(account_number)
    new_company_page.sort_code.set(sort_code)

    # Sales Persons == Account Managers == All Gett Users
    available_sales = new_company_page.sales_person_name.available_options
    available_managers = new_company_page.account_manager.available_options

    expect(available_sales).to match_array(available_managers)
    expect(available_sales).to match_array(gett_users)

    new_company_page.account_manager.select(gett_users.last)
    new_company_page.sales_person_name.select(gett_users.first)

    new_company_page.cost_centre.set('some cost centre')
    new_company_page.legal_company_name.set('aff legal')
    with_headers do
      set_address_headers '167 Fleet Street, London, UK'
      new_company_page.legal_address.select('167 Fleet Street, London, UK')
    end

    new_company_page.attach_image
    new_company_page.critical_flag.click
    new_company_page.ddi_type.select('Mega')
    new_company_page.sap_id.set('A1B2')
    new_company_page.marketing_allowed.click
    new_company_page.default_driver_message.set(driver_message)

    new_company_page.fill_in_admin_credentials(admin)

    set_mock_header gett_api: { products: { template: 'happy_path_affiliate'}}
    new_company_page.fill_in_gett_credentials(UITest.config[:gett][:aff_id])
    expect(new_company_page).to have_gett_id_verify_button(disabled: true, text: 'Verified')

    new_company_page.submit

    wait_until_true { companies_page.loaded? }
    expect(companies_page).to have_companies(count: 2)

    created_company = companies_page.find_company(new_company_name)
    expect(created_company).to have_company_type(text: 'A')
    expect(created_company).to have_company_status(text: 'Active')

    created_company.open_details
    created_company.details.edit_button.click
    wait_until_true { edit_company_page.loaded? }

    expect(edit_company_page.address.selected_options).to include('221B Baker')
    expect(edit_company_page.vat_number.value).to eql('123')
    expect(edit_company_page.account_number.value).to eql(account_number[0...8])
    expect(edit_company_page.sort_code.value).to eql(sort_code[0...6])
    expect(edit_company_page.sales_person_name.selected_options).to eql(gett_users.first)
    expect(edit_company_page.account_manager.selected_options).to eql(gett_users.last)
    expect(edit_company_page.cost_centre.value).to eql('some cost centre')
    expect(edit_company_page.legal_company_name.value).to eql('aff legal')
    expect(edit_company_page.legal_address.selected_options).to include('167 Fleet St')
    expect(edit_company_page.critical_flag).to be_checked
    expect(edit_company_page.ddi_type.selected_options).to eql('Mega')
    expect(edit_company_page.sap_id.value).to eql('A1B2')
    expect(edit_company_page.marketing_allowed).to be_checked
    expect(edit_company_page.default_driver_message.value).to eql(driver_message[0...100])
  end

  scenario 'Edit' do
    edit_company_page.load(id: company.id)

    expect(edit_company_page.payment_types.available_options).to be_blank
    expect(edit_company_page.payment_types.selected_options).to eql(['Cash'])
    expect(edit_company_page.company_type).to be_disabled
    expect(edit_company_page.company_type.text).to eql('Affiliate')

    expect(edit_company_page).to have_no_default_payment_type
    expect(edit_company_page).to have_no_booking_fee
    expect(edit_company_page).to have_no_handling_fee
    expect(edit_company_page).to have_no_invoicing_schedule
    expect(edit_company_page).to have_no_run_in_fee
    expect(edit_company_page).to have_no_phone_booking_fee
    expect(edit_company_page).to have_no_splyt_invoice
    expect(edit_company_page).to have_no_tips
    expect(edit_company_page).to have_no_business_credit
    expect(edit_company_page).to have_no_payment_terms
    expect(edit_company_page).to have_no_gett_cancellation_before_arrival_fee
    expect(edit_company_page).to have_no_gett_cancellation_after_arrival_fee
    expect(edit_company_page).to have_no_gett_e_cancellation_before_arrival_fee
    expect(edit_company_page).to have_no_gett_e_cancellation_after_arrival_fee
    expect(edit_company_page).to have_no_ot_cancellation_before_arrival_fee
    expect(edit_company_page).to have_no_ot_cancellation_after_arrival_fee
    expect(edit_company_page).to have_no_quote_price_increase_percentage
    expect(edit_company_page).to have_no_quote_price_increase_pounds
    expect(edit_company_page).to have_no_international_booking_fee
    expect(edit_company_page).to have_no_additional_billing_recipients
    expect(edit_company_page).to have_no_company_registration_number
    expect(edit_company_page).to have_no_incorporated_at

    expect(edit_company_page).to have_no_travel_policy_mileage_limit
    expect(edit_company_page).to have_no_hw_deviation_distance
    expect(edit_company_page).to have_no_p11d_percentage
    expect(edit_company_page).to have_no_excess_cost_per_mile

    expect(edit_company_page).to have_no_bookings_validation
    expect(edit_company_page).to have_no_api_key
    expect(edit_company_page).to have_no_multiple_booking
    expect(edit_company_page).to have_no_booker_notifications
    expect(edit_company_page).to have_no_mandatory_payroll_id
    expect(edit_company_page).to have_no_mandatory_payroll_cost_centre
    expect(edit_company_page).to have_no_hr_feed_enabled
    expect(edit_company_page).to have_no_allow_preferred_vendor
    expect(edit_company_page).to have_no_default_booker_notifications_emails

    expect(edit_company_page).to have_no_customer_care_password_active
    expect(edit_company_page).to have_no_customer_care_password

    expect(edit_company_page).to have_no_on_boarding
    expect(edit_company_page).to have_no_ot_username
    expect(edit_company_page).to have_no_ot_client_number

    expect(edit_company_page).to have_no_references

    expect(edit_company_page).to have_no_password
    expect(edit_company_page).to have_no_confirm_password

    edit_company_page.company_name.set(new_company_name)
    edit_company_page.address.select('221b Baker Street, London, UK')

    edit_company_page.vat_number.set(123)
    edit_company_page.account_number.set(account_number)
    edit_company_page.sort_code.set(sort_code)

    # Sales Persons == Account Managers == All Gett Users
    available_sales = new_company_page.sales_person_name.available_options
    available_managers = new_company_page.account_manager.available_options
    expect(available_sales).to match_array(gett_users)
    expect(available_sales).to match_array(available_managers)
    edit_company_page.sales_person_name.select(gett_users.first)
    edit_company_page.account_manager.select(gett_users.last)

    edit_company_page.cost_centre.set('some cost centre')
    edit_company_page.legal_company_name.set('aff legal')
    with_headers do
      set_address_headers '167 Fleet Street, London, UK'
      edit_company_page.legal_address.select('167 Fleet Street, London, UK')
    end

    edit_company_page.ddi_type.select('Key')
    edit_company_page.attach_image
    edit_company_page.critical_flag.click
    expect(edit_company_page).to have_critical_due_date_picker
    edit_company_page.marketing_allowed.click
    edit_company_page.sap_id.set('A1B2')
    edit_company_page.default_driver_message.set(driver_message)

    edit_company_page.first_name.set(admin.first_name)
    edit_company_page.second_name.set(admin.last_name)
    edit_company_page.phone_number.set(admin.phone)
    edit_company_page.email.set(admin.email)

    set_mock_header gett_api: { products: { template: 'happy_path_affiliate'}}
    edit_company_page.fill_in_gett_credentials(UITest.config[:gett][:aff_id])
    expect(edit_company_page).to have_gett_id_verify_button(disabled: true, text: 'Verified')
    edit_company_page.save_button.click

    wait_until_true { companies_page.loaded? }
    expect(companies_page).to have_companies(count: 1)

    created_company = companies_page.find_company(new_company_name)
    expect(created_company).to have_company_type(text: 'A')
    expect(created_company).to have_company_status(text: 'Active')

    created_company.open_details
    created_company.details.edit_button.click
    wait_until_true { edit_company_page.loaded? }

    expect(edit_company_page.address.selected_options).to include('221B Baker')
    expect(edit_company_page.vat_number.value).to eql('123')
    expect(edit_company_page.account_number.value).to eql(account_number[0...8])
    expect(edit_company_page.sort_code.value).to eql(sort_code[0...6])
    expect(edit_company_page.sales_person_name.selected_options).to eql(gett_users.first)
    expect(edit_company_page.account_manager.selected_options).to eql(gett_users.last)
    expect(edit_company_page.cost_centre.value).to eql('some cost centre')
    expect(edit_company_page.legal_company_name.value).to eql('aff legal')
    expect(edit_company_page.legal_address.selected_options).to include('167 Fleet St')
    expect(edit_company_page.ddi_type.selected_options).to eql('Key')

    expect(edit_company_page.critical_flag).to be_checked
    expect(edit_company_page).to have_critical_due_date_picker
    expect(edit_company_page.text).to match(/Critical Flag \(Enabled #{Time.current.strftime('%d/%m/%Y')} \d+\:\d+ \w+ by #{super_admin_name}\)/)

    expect(edit_company_page.sap_id.value).to eql('A1B2')
    expect(edit_company_page.marketing_allowed).to be_checked
    expect(edit_company_page.default_driver_message.value).to eql(driver_message[0...100])

    expect(edit_company_page.first_name.value).to eql(admin.first_name)
    expect(edit_company_page.second_name.value).to eql(admin.last_name)
    expect(edit_company_page.phone_number.stripped_value).to eql(admin.phone)
    expect(edit_company_page.email.value).to eql(admin.email)
  end

  scenario 'Delete' do
    companies_page.load

    created_company = companies_page.find_company(company.name)
    created_company.open_details

    expect(created_company.details).to have_deactivate_button
    expect(created_company.details).to have_destroy_button

    created_company.details.destroy_button.click
    companies_page.delete_modal.ok_button.click
    wait_until_true { companies_page.loaded? }
    expect(companies_page).to have_no_companies
  end

  scenario 'Deactivate' do
    create(:booking, company: company, passenger: company.admin)
    companies_page.load

    created_company = companies_page.find_company(company.name)
    created_company.open_details
    expect(created_company.details).to have_deactivate_button
    expect(created_company.details).to have_no_destroy_button

    created_company.details.deactivate_button.click
    companies_page.delete_modal.ok_button.click
    expect(created_company.details).to have_no_deactivate_button
    expect(created_company.details).to have_activate_button
    expect(created_company).to have_company_status(text: 'Inactive')
    expect(created_company.details).to have_manage_bookings_button(disabled: true)

    companies_page.logout
    expect(auth_page).to be_loaded
    auth_page.login_as(company.admin.email)
    expect(auth_page).to have_error_message(text: 'Your company account has been deactivated')
  end
end
