require 'features_helper'

feature 'Critical Flag' do
  let(:bookings_page)     { Pages::Admin.bookings }
  let(:super_admin)       { UITest.super_admin }
  let(:company)           { create(:company, :enterprise) }
  let(:edit_company_page) { Pages::Admin.edit_company }
  let(:super_admin_name)  { UITest.super_admin.full_name }

  scenario 'Orders for VIP passenger or company with Critical Flag should be displayed in Critical tab' do
    non_critical_order = create(:booking, :without_passenger, booker: company.admin)

    second_company = create(:company, :enterprise)
    vip_passenger = create(:passenger, company: second_company, vip: true)
    create(:booking, passenger: vip_passenger)

    login_as_super_admin
    bookings_page.load
    expect(bookings_page).to have_bookings(count: 2)

    bookings_page.tabs.critical.click
    expect(bookings_page).to have_bookings(count: 1)
    expect(bookings_page.bookings.first.type.text).to include('VIP')

    edit_company_page.load(id: company.id)
    edit_company_page.critical_flag.click
    edit_company_page.submit

    critical_order = create(:booking, :without_passenger, booker: company.admin)
    bookings_page.load
    expect(bookings_page).to have_bookings(count: 3)

    bookings_page.tabs.critical.click
    expect(bookings_page).to have_bookings(count: 3)

    expect(bookings_page.find_by_passenger(non_critical_order.passenger_full_name_label).type.text).to include('Critical Company')
    expect(bookings_page.find_by_passenger(critical_order.passenger_full_name_label).type.text).to include('Critical Company')
  end

  # Pending due to https://gett-uk.atlassian.net/browse/OU-3027
  scenario 'Mark and unmark order as critical' do
    order = create(:booking, :without_passenger, booker: company.admin)
    login_as_super_admin
    bookings_page.load
    expect(bookings_page).to have_bookings(count: 1)
    bookings_page.bookings.first.open_details
    bookings_page.bookings.first.details.critical_flag.click

    bookings_page.wait_until_critical_flag_modal_visible
    bookings_page.critical_flag_modal.critical_flag_checkbox.click
    bookings_page.wait_until_critical_flag_modal_invisible

    bookings_page.tabs.critical.click
    expect(bookings_page).to have_bookings(count: 1)

    critical_order = bookings_page.find_by_passenger(order.passenger_full_name_label)
    expect(critical_order.type.text).to match(/Critical Ride/)

    critical_order.open_details
    critical_order.details.critical_flag.click
    bookings_page.wait_until_critical_flag_modal_visible

    expect(bookings_page.critical_flag_modal.critical_flag_checkbox).to be_checked
    expect(bookings_page.critical_flag_modal.text).to match(/Critical Flag\(Enabled by #{super_admin_name} at #{Time.zone.now.strftime('%d/%m/%Y')} \d+\:\d+ \w+\)/)

    bookings_page.critical_flag_modal.critical_flag_checkbox.click
    bookings_page.wait_until_critical_flag_modal_invisible
    bookings_page.tabs.critical.click
    expect(bookings_page).to have_no_bookings
  end
end
