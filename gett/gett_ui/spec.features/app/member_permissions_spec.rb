require 'features_helper'

feature 'Member Permissions' do
  let(:new_booking_page) { Pages::App.new_booking }
  let(:dashboard_page)   { Pages::App.dashboard }

  feature 'Enterprise Company' do
    let(:company) { create(:company, :enterprise, :with_linked_company) }

    scenario 'Passenger' do
      passenger = create(:passenger, company: company)
      login_to_app_as(passenger.email)
      expect(new_booking_page).to be_displayed

      expect(new_booking_page.sidebar).to have_no_bookers
      expect(new_booking_page.sidebar).to have_passengers

      new_booking_page.sidebar.reports.click
      expect(new_booking_page.sidebar.reports_menu).to have_bookings
      expect(new_booking_page.sidebar.reports_menu).to have_no_statistics
      expect(new_booking_page.sidebar.reports_menu).to have_no_procurement_statistics

      new_booking_page.sidebar.settings.click
      expect(new_booking_page.sidebar.settings_menu).to have_no_travel_policy
      expect(new_booking_page.sidebar.settings_menu).to have_no_user_roles
      expect(new_booking_page.sidebar.settings_menu).to have_no_departments
      expect(new_booking_page.sidebar.settings_menu).to have_no_reason_for_travel
      expect(new_booking_page.sidebar.settings_menu).to have_no_billing
      expect(new_booking_page.sidebar.settings_menu).to have_no_office_locations
      expect(new_booking_page.sidebar.settings_menu).to have_no_report_settings
      expect(new_booking_page.sidebar.settings_menu).to have_change_password

      dashboard_page.load
      expect(dashboard_page.internal_message).to have_no_message_field
    end

    scenario 'Booker' do
      booker = create(:booker, company: company)
      login_to_app_as(booker.email)
      expect(new_booking_page).to be_displayed

      expect(new_booking_page.sidebar).to have_bookers
      expect(new_booking_page.sidebar).to have_passengers

      new_booking_page.sidebar.reports.click
      expect(new_booking_page.sidebar.reports_menu).to have_bookings
      expect(new_booking_page.sidebar.reports_menu).to have_no_statistics
      expect(new_booking_page.sidebar.reports_menu).to have_no_procurement_statistics

      new_booking_page.sidebar.settings.click
      expect(new_booking_page.sidebar.settings_menu).to have_no_travel_policy
      expect(new_booking_page.sidebar.settings_menu).to have_no_user_roles
      expect(new_booking_page.sidebar.settings_menu).to have_no_departments
      expect(new_booking_page.sidebar.settings_menu).to have_no_reason_for_travel
      expect(new_booking_page.sidebar.settings_menu).to have_no_billing
      expect(new_booking_page.sidebar.settings_menu).to have_no_office_locations
      expect(new_booking_page.sidebar.settings_menu).to have_no_report_settings
      expect(new_booking_page.sidebar.settings_menu).to have_change_password

      dashboard_page.load
      expect(dashboard_page.internal_message).to have_no_message_field
    end

    scenario 'Finance' do
      finance = create(:finance, company: company)
      login_to_app_as(finance.email)
      expect(new_booking_page).to be_displayed

      expect(new_booking_page.sidebar).to have_bookers
      expect(new_booking_page.sidebar).to have_passengers

      new_booking_page.sidebar.reports.click
      expect(new_booking_page.sidebar.reports_menu).to have_bookings
      expect(new_booking_page.sidebar.reports_menu).to have_no_statistics
      expect(new_booking_page.sidebar.reports_menu).to have_no_procurement_statistics

      new_booking_page.sidebar.settings.click
      expect(new_booking_page.sidebar.settings_menu).to have_no_travel_policy
      expect(new_booking_page.sidebar.settings_menu).to have_no_user_roles
      expect(new_booking_page.sidebar.settings_menu).to have_no_departments
      expect(new_booking_page.sidebar.settings_menu).to have_no_reason_for_travel
      expect(new_booking_page.sidebar.settings_menu).to have_billing
      expect(new_booking_page.sidebar.settings_menu).to have_no_office_locations
      expect(new_booking_page.sidebar.settings_menu).to have_report_settings
      expect(new_booking_page.sidebar.settings_menu).to have_change_password

      dashboard_page.load
      expect(dashboard_page.internal_message).to have_no_message_field
    end

    scenario 'Admin' do
      admin = create(:admin, company: company)
      login_to_app_as(admin.email)
      expect(new_booking_page).to be_displayed

      expect(new_booking_page.sidebar).to have_bookers
      expect(new_booking_page.sidebar).to have_passengers

      new_booking_page.sidebar.reports.click
      expect(new_booking_page.sidebar.reports_menu).to have_bookings
      expect(new_booking_page.sidebar.reports_menu).to have_statistics
      expect(new_booking_page.sidebar.reports_menu).to have_procurement_statistics

      new_booking_page.sidebar.settings.click
      expect(new_booking_page.sidebar.settings_menu).to have_travel_policy
      expect(new_booking_page.sidebar.settings_menu).to have_user_roles
      expect(new_booking_page.sidebar.settings_menu).to have_departments
      expect(new_booking_page.sidebar.settings_menu).to have_reason_for_travel
      expect(new_booking_page.sidebar.settings_menu).to have_billing
      expect(new_booking_page.sidebar.settings_menu).to have_office_locations
      expect(new_booking_page.sidebar.settings_menu).to have_report_settings
      expect(new_booking_page.sidebar.settings_menu).to have_change_password

      dashboard_page.load
      expect(dashboard_page.internal_message).to have_no_message_field
    end

    scenario 'Company Admin' do
      login_to_app_as(company.admin.email)
      dashboard_page.load
      expect(dashboard_page.internal_message).to have_message_field
    end

    scenario 'Travel Manager' do
      travelmanager = create(:travelmanager, company: company)
      login_to_app_as(travelmanager.email)
      expect(new_booking_page).to be_displayed

      expect(new_booking_page.sidebar).to have_bookers
      expect(new_booking_page.sidebar).to have_passengers

      new_booking_page.sidebar.reports.click
      expect(new_booking_page.sidebar.reports_menu).to have_bookings
      expect(new_booking_page.sidebar.reports_menu).to have_statistics
      expect(new_booking_page.sidebar.reports_menu).to have_procurement_statistics

      new_booking_page.sidebar.settings.click
      expect(new_booking_page.sidebar.settings_menu).to have_travel_policy
      expect(new_booking_page.sidebar.settings_menu).to have_user_roles
      expect(new_booking_page.sidebar.settings_menu).to have_departments
      expect(new_booking_page.sidebar.settings_menu).to have_reason_for_travel
      expect(new_booking_page.sidebar.settings_menu).to have_billing
      expect(new_booking_page.sidebar.settings_menu).to have_office_locations
      expect(new_booking_page.sidebar.settings_menu).to have_report_settings
      expect(new_booking_page.sidebar.settings_menu).to have_change_password

      dashboard_page.load
      expect(dashboard_page.internal_message).to have_no_message_field
    end
  end

  feature 'BBC Company' do
    let(:company) { create(:company, :bbc) }

    scenario 'Passenger' do
      passenger = create(:passenger, :bbc_full_pd, company: company)
      login_to_app_as(passenger.email)
      expect(new_booking_page).to be_displayed

      expect(new_booking_page.sidebar).to have_bookers
      expect(new_booking_page.sidebar).to have_passengers

      new_booking_page.sidebar.reports.click
      expect(new_booking_page.sidebar.reports_menu).to have_bookings
      expect(new_booking_page.sidebar.reports_menu).to have_no_statistics
      expect(new_booking_page.sidebar.reports_menu).to have_no_procurement_statistics

      new_booking_page.sidebar.settings.click
      expect(new_booking_page.sidebar.settings_menu).to have_no_travel_policy
      expect(new_booking_page.sidebar.settings_menu).to have_no_user_roles
      expect(new_booking_page.sidebar.settings_menu).to have_no_departments
      expect(new_booking_page.sidebar.settings_menu).to have_no_reason_for_travel
      expect(new_booking_page.sidebar.settings_menu).to have_no_billing
      expect(new_booking_page.sidebar.settings_menu).to have_no_office_locations
      expect(new_booking_page.sidebar.settings_menu).to have_no_report_settings
      expect(new_booking_page.sidebar.settings_menu).to have_change_password

      dashboard_page.load
      expect(dashboard_page.internal_message).to have_no_message_field
    end

    scenario 'Booker' do
      booker = create(:booker, :bbc_full_pd, company: company)
      login_to_app_as(booker.email)
      expect(new_booking_page).to be_displayed

      expect(new_booking_page.sidebar).to have_bookers
      expect(new_booking_page.sidebar).to have_passengers

      new_booking_page.sidebar.reports.click
      expect(new_booking_page.sidebar.reports_menu).to have_bookings
      expect(new_booking_page.sidebar.reports_menu).to have_no_statistics
      expect(new_booking_page.sidebar.reports_menu).to have_no_procurement_statistics

      new_booking_page.sidebar.settings.click
      expect(new_booking_page.sidebar.settings_menu).to have_no_travel_policy
      expect(new_booking_page.sidebar.settings_menu).to have_no_user_roles
      expect(new_booking_page.sidebar.settings_menu).to have_no_departments
      expect(new_booking_page.sidebar.settings_menu).to have_no_reason_for_travel
      expect(new_booking_page.sidebar.settings_menu).to have_no_billing
      expect(new_booking_page.sidebar.settings_menu).to have_no_office_locations
      expect(new_booking_page.sidebar.settings_menu).to have_no_report_settings
      expect(new_booking_page.sidebar.settings_menu).to have_change_password

      dashboard_page.load
      expect(dashboard_page.internal_message).to have_no_message_field
    end

    scenario 'Admin' do
      login_to_app_as(company.admin.email)
      expect(new_booking_page).to be_displayed

      expect(new_booking_page.sidebar).to have_bookers
      expect(new_booking_page.sidebar).to have_passengers

      new_booking_page.sidebar.reports.click
      expect(new_booking_page.sidebar.reports_menu).to have_bookings
      expect(new_booking_page.sidebar.reports_menu).to have_statistics
      expect(new_booking_page.sidebar.reports_menu).to have_no_procurement_statistics

      new_booking_page.sidebar.settings.click
      expect(new_booking_page.sidebar.settings_menu).to have_no_travel_policy
      expect(new_booking_page.sidebar.settings_menu).to have_user_roles
      expect(new_booking_page.sidebar.settings_menu).to have_departments
      expect(new_booking_page.sidebar.settings_menu).to have_no_reason_for_travel
      expect(new_booking_page.sidebar.settings_menu).to have_billing
      expect(new_booking_page.sidebar.settings_menu).to have_office_locations
      expect(new_booking_page.sidebar.settings_menu).to have_report_settings
      expect(new_booking_page.sidebar.settings_menu).to have_change_password

      dashboard_page.load
      expect(dashboard_page.internal_message).to have_message_field
    end
  end
end
