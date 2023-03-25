require 'features_helper'

feature 'Order history tracking' do
  let(:bookings_page)     { Pages::Admin.bookings }
  let(:edit_booking_page) { Pages::Admin.edit_booking }
  let(:company)           { create(:company, :enterprise) }
  let(:passenger)         { create(:passenger, :with_home_address, company: company) }
  let!(:booking) do
    create(:booking, :order_received, :scheduled, international: true, passenger: passenger, booker: company.admin)
  end

  scenario 'should track order id and vehicle' do
    login_as_super_admin

    bookings_page.load
    expect(bookings_page).to have_bookings(count: 1)
    bookings_page.bookings.first.open_details
    bookings_page.bookings.first.details.edit_order.click

    wait_until_true { edit_booking_page.loaded? }
    edit_booking_page.vehicles.wait_until_available
    edit_booking_page.vehicles.special.click
    edit_booking_page.submit

    wait_until_true { bookings_page.loaded? }

    bookings_page.bookings.first.details.order_history.click

    wait_until_true { bookings_page.has_history_modal? }

    modal = bookings_page.history_modal

    type_change = modal.select_by_type('vehicle')
    expect(type_change.size).to eql(1)
    expect(type_change.first.from.text).to eql('Standard')
    expect(type_change.first.to.text).to eql('Special')
    expect(type_change.first.time.text).to include(Time.current.strftime('%Y-%m-%d %H'))

    type_change = modal.select_by_type('order id')
    expect(type_change.size).to eql(1)
    expect(type_change.first.from.text).to eql(booking.service_id)
    expect(type_change.first.to.text).to eql(booking.reload.service_id)
    expect(type_change.first.time.text).to include(Time.current.strftime('%Y-%m-%d %H'))
  end
end
