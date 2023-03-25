require 'features_helper'

feature 'Company' do
  let(:auth_page)         { Pages::Auth.login }
  let(:new_company_page)  { Pages::Admin.new_company }
  let(:edit_company_page) { Pages::Admin.edit_company }
  let(:companies_page)    { Pages::Admin.companies }
  let(:new_company_name)  { Faker::Company.name }
  let(:super_admin_name)  { UITest.super_admin.full_name }
  let(:driver_message)    { Faker::Lorem.characters(110) }
  let(:admin)             { build(:member) }
  let!(:gett_users)       { [create(:user, :sales), create(:user, :customer_care), create(:user, :outsourced_customer_care), UITest.super_admin].map(&:full_name) }
  let!(:company)          { create(:company, :enterprise) }
  let(:new_booking_page)  { Pages::App.new_booking }
  let(:customer_care_pwd) { 'customer_password' }

  scenario 'Create' do
    login_as_super_admin
    companies_page.load
    companies_page.new_company_button.click
    wait_until_true { new_company_page.loaded? }
    expect(new_company_page.company_type.selected_options).to eql('Enterprise')

    # Verify that BBC and Affiliate fields are not displayed
    expect(new_company_page).to have_no_travel_policy_mileage_limit
    expect(new_company_page).to have_no_hw_deviation_distance
    expect(new_company_page).to have_no_p11d_percentage
    expect(new_company_page).to have_no_excess_cost_per_mile

    expect(new_company_page).to have_no_account_number
    expect(new_company_page).to have_no_sort_code

    # Verify required fields
    new_company_page.submit
    expect(new_company_page.company_name.error_message).to eql("can't be blank")
    expect(new_company_page.address.error_message).to eql("Address not found. Please check the address entered.")
    expect(new_company_page.default_payment_type.error_message).to eql("can't be blank")
    expect(new_company_page.first_name.error_message).to eql("can't be blank")
    expect(new_company_page.second_name.error_message).to eql("can't be blank")
    expect(new_company_page.phone_number.error_message).to eql("can't be blank")
    expect(new_company_page.email.error_message).to eql("can't be blank")
    expect(new_company_page.password.error_message).to eql("can't be blank")
    expect(new_company_page.confirm_password.error_message).to eql("can't be blank")
    expect(new_company_page.gett_id.error_message).to eql("can't be blank")
    expect(new_company_page.gett_id.error_message).to eql("can't be blank")
    expect(new_company_page.ot_username.error_message).to eql("can't be blank")
    expect(new_company_page.ot_client_number.error_message).to eql("can't be blank")

    new_company_page.company_name.set(new_company_name)
    new_company_page.address.select('221b Baker Street, London, UK')
    new_company_page.vat_number.set('123')

    # Sales Persons == Account Managers == All Gett Users
    available_sales = new_company_page.sales_person_name.available_options
    available_managers = new_company_page.account_manager.available_options
    expect(available_sales).to match_array(gett_users)
    expect(available_sales).to match_array(available_managers)
    new_company_page.account_manager.select(gett_users.last)
    new_company_page.sales_person_name.select(gett_users.first)

    new_company_page.cost_centre.set('new cost centre')
    new_company_page.legal_company_name.set('Monkey business')
    with_headers do
      set_address_headers '167 Fleet Street, London, UK'
      new_company_page.legal_address.select('167 Fleet Street, London, UK')
    end
    new_company_page.ddi_type.select('Mega')
    new_company_page.attach_image

    new_company_page.critical_flag.click
    expect(new_company_page).to have_critical_due_date_picker

    expect(new_company_page.payment_types.selected_options).to eql(["Account", "Passenger's payment card"])
    new_company_page.default_payment_type.select('Account')
    new_company_page.booking_fee.set('2.5')
    new_company_page.handling_fee.set('42')

    expect(new_company_page.invoicing_schedule.selected_options).to eql('Monthly')
    expect(new_company_page.invoicing_schedule.available_options).to eql(['Weekly', 'Monthly'])
    expect(new_company_page.payment_terms.selected_options).to eql('30')
    expect(new_company_page.payment_terms.available_options).to eql(['0', '7', '14', '30', '60', '90'])
    new_company_page.invoicing_schedule.select('Weekly')
    expect(new_company_page.payment_terms.selected_options).to be_blank
    expect(new_company_page.payment_terms.available_options).to eql(['0', '7', '14', '30', '60', '90'])
    new_company_page.submit
    expect(new_company_page.payment_terms.error_message).to eql("can't be blank")

    new_company_page.run_in_fee.set('5')
    new_company_page.phone_booking_fee.set('3')
    new_company_page.splyt_invoice.select('Department')
    new_company_page.tips.set('5')
    new_company_page.business_credit.set('2000')
    new_company_page.payment_terms.select('14')
    new_company_page.gett_cancellation_before_arrival_fee.set('1.5')
    new_company_page.gett_cancellation_after_arrival_fee.set('5')

    new_company_page.gett_e_cancellation_before_arrival_fee.select('25')
    new_company_page.gett_e_cancellation_after_arrival_fee.select('75')

    new_company_page.ot_cancellation_before_arrival_fee.select('50')
    new_company_page.ot_cancellation_after_arrival_fee.select('25')
    new_company_page.quote_price_increase_percentage.set('7')
    new_company_page.quote_price_increase_pounds.set('4')
    new_company_page.international_booking_fee.set('12')
    new_company_page.sap_id.set('sap_id_123')
    new_company_page.additional_billing_recipients.set('Mike@email.com')
    new_company_page.company_registration_number.set('123')

    new_company_page.marketing_allowed.click
    expect(new_company_page.bookings_validation).to be_disabled
    new_company_page.api_key.click
    expect(new_company_page.multiple_booking).to be_checked
    new_company_page.multiple_booking.click

    expect(new_company_page.booker_notifications).to be_checked
    new_company_page.booker_notifications.click

    new_company_page.mandatory_payroll_id.click
    new_company_page.mandatory_payroll_cost_centre.click
    new_company_page.allow_preferred_vendor.click

    new_company_page.default_driver_message.set(driver_message)

    new_company_page.default_booker_notifications_emails.set('some@email.com, admin@fakemail.com')
    new_company_page.customer_care_password_active.click
    new_company_page.customer_care_password.set('password')

    new_company_page.fill_in_admin_credentials(admin)

    new_company_page.fill_in_gett_credentials
    expect(new_company_page).to have_gett_id_verify_button(disabled: true, text: 'Verified')

    new_company_page.fill_in_ot_credentials
    expect(new_company_page).to have_ot_verify_button(disabled: true, text: 'Verified')

    new_company_page.references.first.active.click
    new_company_page.references.first.mandatory.click
    new_company_page.references.first.name.set('Simple Mandatory Field')
    expect(new_company_page.bookings_validation).not_to be_disabled
    new_company_page.bookings_validation.click

    new_company_page.save_button.click
    wait_until_true { companies_page.loaded? }
    expect(companies_page).to have_companies(count: 2)

    created_company = companies_page.find_company(new_company_name)
    expect(created_company).to have_company_type(text: 'E')
    expect(created_company).to have_company_status(text: 'Active')

    created_company.open_details
    created_company.details.edit_button.click
    wait_until_true { edit_company_page.loaded? }

    expect(edit_company_page.address.selected_options).to include('221B Baker')
    expect(edit_company_page.vat_number.value).to eql('123')
    expect(edit_company_page.sales_person_name.selected_options).to eql(gett_users.first)
    expect(edit_company_page.account_manager.selected_options).to eql(gett_users.last)
    expect(edit_company_page.cost_centre.value).to eql('new cost centre')

    expect(edit_company_page.legal_company_name.value).to eql('Monkey business')
    expect(edit_company_page.legal_address.selected_options).to include('167 Fleet St')
    expect(edit_company_page.ddi_type.selected_options).to eql('Mega')

    expect(edit_company_page.critical_flag).to be_checked
    expect(edit_company_page).to have_critical_due_date_picker
    expect(edit_company_page.text).to match(/Critical Flag \(Enabled #{Time.current.strftime('%d/%m/%Y')} \d+\:\d+ \w+ by #{super_admin_name}\)/)

    expect(edit_company_page.payment_types.selected_options).to eql(["Account", "Passenger's payment card"])
    expect(edit_company_page.default_payment_type.selected_options).to eql('Account')

    expect(edit_company_page.booking_fee.value).to eql('2.5')
    expect(edit_company_page.handling_fee.value).to eql('42')
    expect(edit_company_page.invoicing_schedule.selected_options).to eql('Weekly')
    expect(edit_company_page.payment_terms.selected_options).to eql('14')
    expect(edit_company_page.run_in_fee.value).to eql('5')
    expect(edit_company_page.phone_booking_fee.value).to eql('3')
    expect(edit_company_page.splyt_invoice.selected_options).to eql('Department')
    expect(edit_company_page.tips.value).to eql('5')
    expect(edit_company_page.business_credit.value).to eql('2000')
    expect(edit_company_page.gett_cancellation_before_arrival_fee.value).to eql('1.5')
    expect(edit_company_page.gett_cancellation_after_arrival_fee.value).to eql('5')
    expect(edit_company_page.gett_e_cancellation_before_arrival_fee.selected_options).to eql('25%')
    expect(edit_company_page.gett_e_cancellation_after_arrival_fee.selected_options).to eql('75%')
    expect(edit_company_page.ot_cancellation_before_arrival_fee.selected_options).to eql('50%')
    expect(edit_company_page.ot_cancellation_after_arrival_fee.selected_options).to eql('25%')
    expect(edit_company_page.quote_price_increase_percentage.value).to eql('7')
    expect(edit_company_page.quote_price_increase_pounds.value).to eql('4')
    expect(edit_company_page.international_booking_fee.value).to eql('12')
    expect(edit_company_page.sap_id.value).to eql('sap_id_123')
    expect(edit_company_page.additional_billing_recipients.value).to eql('Mike@email.com')
    expect(edit_company_page.company_registration_number.value).to eql('123')
    expect(edit_company_page.marketing_allowed).to be_checked
    expect(edit_company_page.api_key).to be_checked
    expect(edit_company_page.multiple_booking).not_to be_checked
    expect(edit_company_page.booker_notifications).not_to be_checked
    expect(edit_company_page.mandatory_payroll_id).to be_checked
    expect(edit_company_page.mandatory_payroll_cost_centre).to be_checked
    expect(edit_company_page.allow_preferred_vendor).to be_checked
    expect(edit_company_page.default_driver_message.value).to eql(driver_message[0...100])
    expect(edit_company_page.default_booker_notifications_emails.value).to eql('some@email.com, admin@fakemail.com')
    expect(edit_company_page.customer_care_password_active).to be_checked

    expect(edit_company_page.first_name.value).to eql(admin.first_name)
    expect(edit_company_page.second_name.value).to eql(admin.last_name)
    expect(edit_company_page.phone_number.stripped_value).to eql(admin.phone)
    expect(edit_company_page.email.value).to eql(admin.email)

    expect(edit_company_page.references.first.active).to be_checked
    expect(edit_company_page.references.first.mandatory).to be_checked
    expect(edit_company_page.references.first.name.value).to eql('Simple Mandatory Field')
    expect(edit_company_page.bookings_validation).to be_checked
  end

  scenario 'Edit' do
    auth_page.login_as_super_admin
    edit_company_page.load(id: company.id)
    expect(edit_company_page.invoicing_schedule).not_to be_disabled

    expect(edit_company_page).to have_company_type(text: 'Enterprise')
    expect(edit_company_page.company_type).to be_disabled

    edit_company_page.company_name.set(new_company_name)
    edit_company_page.address.select('221b Baker Street, London, UK')
    edit_company_page.vat_number.set('123')

    # Sales Persons == Account Managers == All Gett Users
    available_sales = edit_company_page.sales_person_name.available_options
    available_managers = edit_company_page.account_manager.available_options
    expect(available_sales).to match_array(gett_users)
    expect(available_sales).to match_array(available_managers)
    edit_company_page.account_manager.select(gett_users.last)
    edit_company_page.sales_person_name.select(gett_users.first)

    edit_company_page.cost_centre.set('new cost centre')
    edit_company_page.legal_company_name.set('Monkey business')
    with_headers do
      set_address_headers '167 Fleet Street, London, UK'
      edit_company_page.legal_address.select('167 Fleet Street, London, UK')
    end
    edit_company_page.ddi_type.select('Mega')
    edit_company_page.attach_image
    edit_company_page.critical_flag.click
    expect(edit_company_page.payment_types.selected_options).to eql(["Account", "Passenger's payment card", "Cash"])
    edit_company_page.payment_types.unselect('Account')
    edit_company_page.payment_types.select('Company payment card')
    edit_company_page.default_payment_type.select('Company Payment Card')

    # negative check + number check
    fields = %i[booking_fee handling_fee run_in_fee phone_booking_fee tips business_credit gett_cancellation_before_arrival_fee gett_cancellation_after_arrival_fee quote_price_increase_percentage quote_price_increase_pounds international_booking_fee]

    fields.each do |field|
      edit_company_page.send(field).set('-01')
    end
    edit_company_page.save_button.click
    fields.each do |field|
      expect(edit_company_page.send(field).error.text).to eql('must be greater than or equal to 0')
      edit_company_page.send(field).set('a4b')
    end

    edit_company_page.save_button.click

    # number check
    fields.each do |field|
      expect(edit_company_page.send(field).error.text).to eql('is not a number')
    end

    edit_company_page.booking_fee.set('2.5')
    edit_company_page.handling_fee.set('42')

    expect(edit_company_page.invoicing_schedule.selected_options).to eql('Monthly')
    expect(edit_company_page.invoicing_schedule.available_options).to eql(['Weekly', 'Monthly'])
    expect(edit_company_page.payment_terms.selected_options).to eql('30')
    expect(edit_company_page.payment_terms.available_options).to eql(['0', '7', '14', '30', '60', '90'])

    edit_company_page.run_in_fee.set('5')
    edit_company_page.phone_booking_fee.set('3')
    expect(edit_company_page.splyt_invoice.available_options).to match_array(['User', 'Department', 'Reference'])
    edit_company_page.splyt_invoice.select('User')
    edit_company_page.tips.set('5')
    edit_company_page.business_credit.set('2000')
    edit_company_page.payment_terms.select('14')
    edit_company_page.gett_cancellation_before_arrival_fee.set('1.5')
    edit_company_page.gett_cancellation_after_arrival_fee.set('5')

    expect(edit_company_page.gett_e_cancellation_before_arrival_fee.available_options).to match_array(['0%', '25%', '50%', '75%', '100%'])
    edit_company_page.gett_e_cancellation_before_arrival_fee.select('25')
    expect(edit_company_page.gett_e_cancellation_after_arrival_fee.available_options).to match_array(['0%', '25%', '50%', '75%', '100%'])
    edit_company_page.gett_e_cancellation_after_arrival_fee.select('75')

    expect(edit_company_page.ot_cancellation_before_arrival_fee.available_options).to match_array(['0%', '25%', '50%', '75%', '100%'])
    edit_company_page.ot_cancellation_before_arrival_fee.select('50')
    expect(edit_company_page.ot_cancellation_after_arrival_fee.available_options).to match_array(['0%', '25%', '50%', '75%', '100%'])
    edit_company_page.ot_cancellation_after_arrival_fee.select('25')

    expect(edit_company_page.splyt_cancellation_before_arrival_fee.available_options).to match_array(['0%', '25%', '50%', '75%', '100%'])
    edit_company_page.splyt_cancellation_before_arrival_fee.select('50')
    expect(edit_company_page.splyt_cancellation_after_arrival_fee.available_options).to match_array(['0%', '25%', '50%', '75%', '100%'])
    edit_company_page.splyt_cancellation_after_arrival_fee.select('25')

    expect(edit_company_page.carey_cancellation_before_arrival_fee.available_options).to match_array(['0%', '25%', '50%', '75%', '100%'])
    edit_company_page.carey_cancellation_before_arrival_fee.select('50')
    expect(edit_company_page.carey_cancellation_after_arrival_fee.available_options).to match_array(['0%', '25%', '50%', '75%', '100%'])
    edit_company_page.carey_cancellation_after_arrival_fee.select('25')

    edit_company_page.quote_price_increase_percentage.set('7')
    edit_company_page.quote_price_increase_pounds.set('4')
    edit_company_page.international_booking_fee.set('12')
    edit_company_page.additional_billing_recipients.set('Mike@email.com')
    edit_company_page.sap_id.set('sap_id_123')
    edit_company_page.company_registration_number.set('123')

    edit_company_page.marketing_allowed.click
    expect(edit_company_page.bookings_validation).to be_disabled
    edit_company_page.api_key.click
    edit_company_page.multiple_booking.click
    edit_company_page.booker_notifications.click
    edit_company_page.mandatory_payroll_id.click
    edit_company_page.mandatory_payroll_cost_centre.click
    edit_company_page.allow_preferred_vendor.click

    edit_company_page.default_driver_message.set(driver_message)

    edit_company_page.default_booker_notifications_emails.set('some@email.com, admin@fakemail.com')
    edit_company_page.customer_care_password_active.click
    edit_company_page.customer_care_password.set('password')

    edit_company_page.fill_in_admin_credentials(admin)

    edit_company_page.fill_in_gett_credentials
    expect(edit_company_page).to have_gett_id_verify_button(disabled: true, text: 'Verified')

    edit_company_page.fill_in_ot_credentials
    expect(edit_company_page).to have_ot_verify_button(disabled: true, text: 'Verified')

    edit_company_page.references.first.active.click
    edit_company_page.references.first.mandatory.click
    edit_company_page.references.first.name.set('Simple Mandatory Field')
    expect(edit_company_page.bookings_validation).not_to be_disabled
    edit_company_page.bookings_validation.click

    edit_company_page.save_button.click
    wait_until_true { companies_page.loaded? }
    expect(companies_page).to have_companies(count: 1)

    created_company = companies_page.find_company(new_company_name)
    expect(created_company).to have_company_type(text: 'E')
    expect(created_company).to have_company_status(text: 'Active')

    created_company.open_details
    created_company.details.edit_button.click
    wait_until_true { edit_company_page.loaded? }

    expect(edit_company_page.address.selected_options).to include('221B Baker')
    expect(edit_company_page.vat_number.value).to eql('123')
    expect(edit_company_page.sales_person_name.selected_options).to eql(gett_users.first)
    expect(edit_company_page.account_manager.selected_options).to eql(gett_users.last)
    expect(edit_company_page.cost_centre.value).to eql('new cost centre')

    expect(edit_company_page.legal_company_name.value).to eql('Monkey business')
    expect(edit_company_page.legal_address.selected_options).to include('167 Fleet St')
    expect(edit_company_page.ddi_type.selected_options).to eql('Mega')

    expect(edit_company_page.critical_flag).to be_checked
    expect(edit_company_page).to have_critical_due_date_picker
    expect(edit_company_page.text).to match(/Critical Flag \(Enabled #{Time.current.strftime('%d/%m/%Y')} \d+\:\d+ \w+ by #{super_admin_name}\)/)

    expect(edit_company_page.payment_types.selected_options).to eql(["Passenger's payment card", "Company payment card"])
    expect(edit_company_page.default_payment_type.selected_options).to eql('Company Payment Card')

    expect(edit_company_page.booking_fee.value).to eql('2.5')
    expect(edit_company_page.handling_fee.value).to eql('42')
    expect(edit_company_page.invoicing_schedule.selected_options).to eql('Monthly')
    expect(edit_company_page.payment_terms.selected_options).to eql('14')
    expect(edit_company_page.run_in_fee.value).to eql('5')
    expect(edit_company_page.phone_booking_fee.value).to eql('3')
    expect(edit_company_page.splyt_invoice.selected_options).to eql('User')
    expect(edit_company_page.tips.value).to eql('5')
    expect(edit_company_page.business_credit.value).to eql('2000')
    expect(edit_company_page.gett_cancellation_before_arrival_fee.value).to eql('1.5')
    expect(edit_company_page.gett_cancellation_after_arrival_fee.value).to eql('5')
    expect(edit_company_page.gett_e_cancellation_before_arrival_fee.selected_options).to eql('25%')
    expect(edit_company_page.gett_e_cancellation_after_arrival_fee.selected_options).to eql('75%')
    expect(edit_company_page.ot_cancellation_before_arrival_fee.selected_options).to eql('50%')
    expect(edit_company_page.ot_cancellation_after_arrival_fee.selected_options).to eql('25%')
    expect(edit_company_page.quote_price_increase_percentage.value).to eql('7')
    expect(edit_company_page.quote_price_increase_pounds.value).to eql('4')
    expect(edit_company_page.international_booking_fee.value).to eql('12')
    expect(edit_company_page.sap_id.value).to eql('sap_id_123')
    expect(edit_company_page.additional_billing_recipients.value).to eql('Mike@email.com')
    expect(edit_company_page.company_registration_number.value).to eql('123')
    expect(edit_company_page.marketing_allowed).to be_checked
    expect(edit_company_page.api_key).to be_checked
    expect(edit_company_page.multiple_booking).to be_checked
    expect(edit_company_page.booker_notifications).to be_checked
    expect(edit_company_page.mandatory_payroll_id).to be_checked
    expect(edit_company_page.mandatory_payroll_cost_centre).to be_checked
    expect(edit_company_page.allow_preferred_vendor).to be_checked
    expect(edit_company_page.default_driver_message.value).to eql(driver_message[0...100])
    expect(edit_company_page.default_booker_notifications_emails.value).to eql('some@email.com, admin@fakemail.com')
    expect(edit_company_page.customer_care_password_active).to be_checked

    expect(edit_company_page.first_name.value).to eql(admin.first_name)
    expect(edit_company_page.second_name.value).to eql(admin.last_name)
    expect(edit_company_page.phone_number.stripped_value).to eql(admin.phone)
    expect(edit_company_page.email.value).to eql(admin.email)

    expect(edit_company_page.references.first.active).to be_checked
    expect(edit_company_page.references.first.mandatory).to be_checked
    expect(edit_company_page.references.first.name.value).to eql('Simple Mandatory Field')
    expect(edit_company_page.bookings_validation).to be_checked

    passenger = create(:passenger, :with_home_address, company: company)
    create(:booking, passenger: passenger)

    edit_company_page.load(id: company.id)
    expect(edit_company_page.invoicing_schedule).to be_disabled
  end

  scenario 'Delete' do
    login_as_super_admin
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
    login_as_super_admin
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

  scenario 'Customer Care Password' do
    existed_company = create(:company, customer_care_password: customer_care_pwd)
    customer_care_user = create(:user, :customer_care)

    login_to_admin_as(customer_care_user.email)

    expect(companies_page).to have_companies(count: 2)
    company = companies_page.find_company(existed_company.name)
    company.open_details
    company.details.manage_bookings_button.click

    expect(companies_page).to have_customer_care_password_modal
    companies_page.customer_care_password_modal.password.set(customer_care_pwd)
    companies_page.customer_care_password_modal.ok_button.click

    wait_until_true { new_booking_page.loaded? }
    expect(new_booking_page.reincarnate.company_name.text).to eql(existed_company.name)

    new_booking_page.reincarnate.return_to_back_office_button.click
    wait_until_true { companies_page.loaded? }
  end
end
