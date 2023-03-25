require 'features_helper'

feature 'Active Bookings - Cancel Order' do
  let(:bookings_page) { Pages::App.bookings }
  let(:company)       { create(:company, :enterprise) }
  let(:passenger)     { create(:passenger, :with_home_address, company: company) }

  scenario 'Cancel Future Order' do
    create(:booking, :in_progress, :without_passenger, booker: company.admin)
    create(:booking, :without_passenger, booker: company.admin)

    login_to_app_as(company.admin.email)

    bookings_page.load
    expect(bookings_page).to have_bookings(count: 2)

    bookings_page.bookings.first.open_details
    expect(bookings_page.bookings.first.details).to have_cancel_order(disabled: true)

    bookings_page.bookings.last.open_details
    expect(bookings_page.bookings.last.details).to have_cancel_order
    bookings_page.bookings.last.details.cancel_order.click

    bookings_page.wait_until_cancel_order_modal_visible
    bookings_page.cancel_order_modal.submit
    bookings_page.wait_until_cancel_order_modal_invisible

    bookings_page.load
    expect(bookings_page).to have_bookings(count: 1)
  end
end
