require 'features_helper'

feature 'Back Office Bookings - Resend Order' do
  let(:bookings_page) { Pages::Admin.bookings }
  let(:company)       { create(:company, :enterprise, admin_phone: '+44720926259') }
  let(:passenger)     { create(:passenger, :with_home_address, company: company) }
  let(:order)         { wait_for { bookings_page.bookings.first } }

  scenario 'Validate Fields Population' do
    booking = create(:booking, :customer_care, :cash, :with_flight, message: 'Hurry Up!', passenger: company.admin)
    cost_centre_reference = create(:booking_reference, :cost_centre, company: company)
    create(:booker_reference, booking: booking, value: 'cost_centre', booking_reference_name: cost_centre_reference.name)
    stop_point_address = create(:address, :mercedes_glasgow)
    create(:booking_address, booking_id: booking.id, address_id: stop_point_address.id, address_type: 'stop', stop_info: { name: 'Fake User', phone: '+44 1234 56789' })

    login_as_super_admin
    bookings_page.load
    expect(bookings_page).to have_bookings(count: 1)
    expect(order.status.text).to eql('Customer Care')
    order.open_details
    order.details.resend_order.click

    bookings_page.load
    expect(bookings_page).to have_bookings(count: 1)

    order = bookings_page.bookings.first
    expect(order.status.text).to eql('Order received')
    expect(order.payment_type.text).to eql('Cash')
    order.open_details

    details = order.details
    expect(details.passenger_name.text).to eql(company.admin.full_name)
    expect(details.passenger_phone.text).to eql('+44 7209 26259')
    expect(details.message_to_driver.text).to eql('Flight: EK 530, Hurry Up!')
    expect(details.references.text).to include('Cost Centre: cost_centre')
    expect(details.flight_number.text).to eql('EK 530')
  end
end
