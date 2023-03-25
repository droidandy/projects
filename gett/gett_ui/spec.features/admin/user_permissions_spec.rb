require 'features_helper'

feature 'User Permissions' do
  let(:companies_page)       { Pages::Admin.companies }
  let(:bookings_page)        { Pages::Admin.bookings }
  let(:notifications_page)   { Pages::Admin.notifications }
  let(:users_page)           { Pages::Admin.gett_users }
  let(:poi_page)             { Pages::Admin.poi_list }
  let(:system_page)          { Pages::Admin.system }
  let(:billing_page)         { Pages::Admin.billing }
  let(:statistics_page)      { Pages::Admin.statistics }
  let(:ote_new_booking_page) { Pages::Admin.ote_new_booking }
  let!(:company)             { create(:company) }

  scenario 'SuperAdmin' do
    login_as_super_admin
    expect(companies_page).to be_loaded
    expect(companies_page).to have_new_company_button

    test_company = companies_page.find_company(company.name)
    test_company.open_details
    expect(test_company.details).to have_edit_button
    expect(test_company.details).to have_destroy_button
    expect(test_company.details).to have_deactivate_button
    expect(test_company.details).to have_manage_bookings_button

    companies_page.sidebar.bookings.click
    wait_until_true { bookings_page.loaded? }

    bookings_page.sidebar.notifications.click
    wait_until_true { notifications_page.loaded? }

    notifications_page.sidebar.statistics.click
    wait_until_true { statistics_page.loaded? }

    statistics_page.sidebar.users.click
    statistics_page.sidebar.users_menu.gett_users.click
    wait_until_true { users_page.loaded? }
    expect(users_page).to have_new_user_button

    users_page.sidebar.settings.click
    users_page.sidebar.settings_menu.poi.click
    wait_until_true { poi_page.loaded? }

    poi_page.sidebar.settings_menu.system.click
    wait_until_true { system_page.loaded? }

    create(:booking, :completed, :with_charges, :without_passenger, :gett, booker: company.admin)
    create(:invoice, company: company, amount_cents: 1000)

    system_page.sidebar.settings_menu.billing.click
    wait_until_true { billing_page.loaded? }
    expect(billing_page).to have_invoices
    invoice = billing_page.invoices.first
    invoice.actions.click
    expect(invoice.actions_menu).to have_disable_company
    expect(invoice.actions_menu).to have_mark_as_paid

    billing_page.sidebar.ote_new_booking.click
    wait_until_true { ote_new_booking_page.loaded? }
  end

  scenario 'Admin' do
    admin = create(:user, :admin)
    login_to_admin_as(admin.email)
    expect(companies_page).to be_loaded
    expect(companies_page).to have_new_company_button

    test_company = companies_page.find_company(company.name)
    test_company.open_details
    expect(test_company.details).to have_edit_button
    expect(test_company.details).to have_no_destroy_button
    expect(test_company.details).to have_deactivate_button
    expect(test_company.details).to have_manage_bookings_button

    companies_page.sidebar.bookings.click
    wait_until_true { bookings_page.loaded? }

    expect(bookings_page.sidebar).to have_no_notifications

    bookings_page.sidebar.statistics.click
    wait_until_true { statistics_page.loaded? }

    statistics_page.sidebar.users.click
    statistics_page.sidebar.users_menu.gett_users.click
    wait_until_true { users_page.loaded? }
    expect(users_page).to have_new_user_button

    users_page.sidebar.settings.click
    expect(users_page.sidebar.settings_menu).to have_no_poi
    expect(users_page.sidebar.settings_menu).to have_no_system

    create(:booking, :completed, :with_charges, :without_passenger, :gett, booker: company.admin)
    create(:invoice, company: company, amount_cents: 1000)

    users_page.sidebar.settings_menu.billing.click
    wait_until_true { billing_page.loaded? }
    expect(billing_page).to have_invoices
    invoice = billing_page.invoices.first
    invoice.actions.click
    expect(invoice.actions_menu).to have_disable_company
    expect(invoice.actions_menu).to have_mark_as_paid

    billing_page.sidebar.ote_new_booking.click
    wait_until_true { ote_new_booking_page.loaded? }
  end

  scenario 'Sales' do
    admin = create(:user, :sales)
    login_to_admin_as(admin.email)
    expect(companies_page).to be_loaded
    expect(companies_page).to have_new_company_button

    test_company = companies_page.find_company(company.name)
    test_company.open_details
    expect(test_company.details).to have_edit_button
    expect(test_company.details).to have_no_destroy_button
    expect(test_company.details).to have_no_deactivate_button
    expect(test_company.details).to have_manage_bookings_button

    companies_page.sidebar.bookings.click
    wait_until_true { bookings_page.loaded? }

    expect(bookings_page.sidebar).to have_no_notifications
    expect(bookings_page.sidebar).to have_no_statistics

    bookings_page.sidebar.users.click
    bookings_page.sidebar.users_menu.gett_users.click
    expect(users_page).to be_displayed
    expect(users_page).to have_no_new_user_button

    users_page.sidebar.settings.click
    expect(users_page.sidebar.settings_menu).to have_no_poi
    expect(users_page.sidebar.settings_menu).to have_no_system

    create(:booking, :completed, :with_charges, :without_passenger, :gett, booker: company.admin)
    create(:invoice, company: company, amount_cents: 1000)

    users_page.sidebar.settings_menu.billing.click
    wait_until_true { billing_page.loaded? }
    expect(billing_page).to have_invoices
    invoice = billing_page.invoices.first
    invoice.actions.click
    expect(invoice.actions_menu).to have_no_disable_company
    expect(invoice.actions_menu).to have_no_mark_as_paid

    billing_page.sidebar.ote_new_booking.click
    wait_until_true { ote_new_booking_page.loaded? }
  end

  scenario 'Customer Care' do
    customer_care = create(:user, :customer_care)
    login_to_admin_as(customer_care.email)
    expect(companies_page).to be_loaded
    expect(companies_page).to have_no_new_company_button

    test_company = companies_page.find_company(company.name)
    test_company.open_details
    expect(test_company.details).to have_no_edit_button
    expect(test_company.details).to have_no_destroy_button
    expect(test_company.details).to have_no_deactivate_button
    expect(test_company.details).to have_manage_bookings_button

    companies_page.sidebar.bookings.click
    wait_until_true { bookings_page.loaded? }

    expect(bookings_page.sidebar).to have_no_notifications
    expect(bookings_page.sidebar).to have_no_statistics

    bookings_page.sidebar.users.click
    bookings_page.sidebar.users_menu.gett_users.click
    expect(users_page).to be_displayed
    expect(users_page).to have_no_new_user_button

    expect(users_page.sidebar).to have_no_settings

    users_page.sidebar.ote_new_booking.click
    wait_until_true { ote_new_booking_page.loaded? }
  end

  scenario 'Outsources Customer Care' do
    customer_care = create(:user, :outsourced_customer_care)
    login_to_admin_as(customer_care.email)
    wait_until_true { ote_new_booking_page.loaded? }

    expect(ote_new_booking_page.sidebar).to have_no_companies
    expect(ote_new_booking_page.sidebar).to have_no_bookings
    expect(ote_new_booking_page.sidebar).to have_no_notifications
    expect(ote_new_booking_page.sidebar).to have_no_statistics
    expect(ote_new_booking_page.sidebar).to have_no_users
    expect(ote_new_booking_page.sidebar).to have_no_settings
    expect(ote_new_booking_page.sidebar).to have_ote_new_booking
  end
end
