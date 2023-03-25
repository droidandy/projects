require 'features_helper'

feature 'Back Office Bookings - Repeat Order' do
  let(:bookings_page)     { Pages::Admin.bookings }
  let(:edit_booking_page) { Pages::Admin.repeat_booking }
  let(:company)           { create(:company, :enterprise, admin_phone: '+44758517213') }
  let(:passenger)         { create(:passenger, :with_home_address, company: company) }
  let(:order)             { wait_for { bookings_page.bookings.first } }

  scenario 'Validate Fields Population' do
    booking = create(:booking, :cancelled, :cash, :with_flight, message: 'Hurry Up!', passenger: company.admin)
    cost_centre_reference = create(:booking_reference, :cost_centre, company: company)
    create(:booker_reference, booking: booking, value: 'cost_centre', booking_reference_name: cost_centre_reference.name)
    stop_point_address = create(:address, :mercedes_glasgow)
    create(:booking_address, booking_id: booking.id, address_id: stop_point_address.id, address_type: 'stop', stop_info: { name: 'Fake User', phone: '+44 1234 56789' })

    login_as_super_admin

    bookings_page.load
    expect(bookings_page).to have_bookings(count: 1)
    expect(order.status.text).to eql('Cancelled')
    order.open_details
    order.details.repeat_booking.click
    wait_until_true { edit_booking_page.loaded? }

    expect(edit_booking_page.passenger_name.text).to eql(company.admin.full_name)
    expect(edit_booking_page.phone_number.value).to eql('+44 7585 17213')

    expect(edit_booking_page.pickup_address.text).to start_with('167 Fleet St')
    expect(edit_booking_page.destination_address.text).to start_with('221B Baker St')

    expect(edit_booking_page.stop_points.first.name.text).to eql('Fake User')
    expect(edit_booking_page.stop_points.first.phone.value).to eql('+44 1234 56789')
    expect(edit_booking_page.stop_points.first.address.text).to start_with('Mercedes-Benz of Glasgow')

    expect(edit_booking_page.vehicles.selected_car).to eql('Black Taxi')
    expect(edit_booking_page.payment_method.text).to eql('Cash')
    expect(edit_booking_page.message_to_driver.text).to eql('Hurry Up!')
    expect(edit_booking_page.references.first.field.value).to eql('cost_centre')
    expect(edit_booking_page.flight_number.value).to eql('EK 530')

    edit_booking_page.submit
    wait_until_true { bookings_page.loaded? }
    expect(bookings_page).to have_bookings(count: 2)

    new_order = bookings_page.bookings.last
    expect(new_order.status.text).to eql('Order received')
    # expect(order.payment_type.text).to eql('Cash') #TODO bug
    details = new_order.details
    expect(details.passenger_name.text).to eql(company.admin.full_name)
    expect(details.passenger_phone.text).to eql('+44 7585 17213')
    expect(details.booker_name.text).to eql('Customer Care')
    expect(details.message_to_driver.text).to eql('Flight: EK 530, Hurry Up!')
    expect(details.references.text).to include('Cost Centre: cost_centre')
    expect(details.flight_number.text).to eql('EK 530')
  end
end
