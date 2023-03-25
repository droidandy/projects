require 'features_helper'

feature 'Booking Page' do
  let(:bookings_page) { Pages::Admin.bookings }
  let(:ent_company)   { create(:company, :enterprise) }
  let(:aff_company)   { create(:company, :affiliate) }

  scenario 'Tabs' do
    vip_pass = create(:passenger, vip: true, company: ent_company)
    create(:booking, :creating, :critical, :without_passenger, booker: aff_company.admin)
    create(:booking, :order_received, :without_passenger, booker: ent_company.admin)
    create(:booking, :cancelled, :with_alert, :without_passenger, booker: ent_company.admin)
    create(:booking, :locating, :without_passenger, booker: ent_company.admin)
    create(:booking, :on_the_way, :without_passenger, booker: aff_company.admin)
    create(:booking, :arrived, :without_passenger, booker: ent_company.admin)
    create(:booking, :in_progress, :without_passenger, booker: ent_company.admin)
    create(:booking, :completed, :without_passenger, booker: ent_company.admin)
    create(:booking, :rejected, :without_passenger, booker: aff_company.admin)
    create(:booking, :customer_care, :without_passenger, booker: ent_company.admin)
    create(:booking, :without_passenger, status: :processing, booker: ent_company.admin)
    create(:booking, :scheduled, :without_passenger, passenger: vip_pass)

    login_as_super_admin
    bookings_page.load

    bookings_page.tabs.active.click
    expect(bookings_page).to have_bookings(count: 6)

    expect(bookings_page.bookings.map(&:status_text)).to eql(['Creating', 'Locating a taxi', 'Taxi on the way', 'Taxi arrived', 'In Progress', 'Creating'])

    bookings_page.tabs.future.click
    expect(bookings_page).to have_bookings(count: 1)
    expect(bookings_page.bookings.first.status_text).to eql('Order received')

    bookings_page.tabs.completed.click
    expect(bookings_page).to have_bookings(count: 3)
    expect(bookings_page.bookings.map(&:status_text)).to eql(['Rejected', 'Completed', 'Cancelled'])

    bookings_page.tabs.affiliate.click
    expect(bookings_page).to have_bookings(count: 3)
    expect(bookings_page.bookings.map(&:status_text)).to eql(['Rejected', 'Taxi on the way', 'Creating'])

    bookings_page.tabs.enterprise.click
    expect(bookings_page).to have_bookings(count: 9)
    expect(bookings_page.bookings.map(&:status_text)).to eql(['Creating', 'Processing', 'Customer Care', 'Completed', 'In Progress', 'Taxi arrived', 'Locating a taxi', 'Cancelled', 'Order received'])

    bookings_page.tabs.all.click
    expect(bookings_page).to have_bookings(count: 10)
    bookings_page.pagination.select_page(2)
    expect(bookings_page).to have_bookings(count: 2)

    bookings_page.tabs.alert.click
    expect(bookings_page).to have_bookings(count: 3)
    expect(bookings_page.bookings.map(&:status_text)).to eql(['Cancelled', 'Customer Care', 'Processing'])

    bookings_page.tabs.critical.click
    expect(bookings_page).to have_bookings(count: 2)
    expect(bookings_page.bookings.map(&:status_text)).to eql(['Creating', 'Creating'])
  end

  scenario 'Links to Customer and Booker in order details' do
    edit_user_page = Pages::Admin.edit_user
    passenger = create(:passenger, company: ent_company)
    order = create(:booking, passenger: passenger, booker: ent_company.admin)

    login_as_super_admin
    bookings_page.load(order: order.id)
    wait_for{ bookings_page.bookings.first }.details.passenger_name.click
    expect(edit_user_page).to be_displayed
    expect(edit_user_page.email.value).to eql(passenger.email)

    bookings_page.load(order: order.id)
    wait_until_true { bookings_page.bookings.present? }
    bookings_page.bookings.first.open_details
    bookings_page.bookings.first.details.booker_name.click
    expect(edit_user_page).to be_displayed
    expect(edit_user_page.email.value).to eql(ent_company.admin.email)
  end
end
