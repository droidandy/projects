RSpec.shared_examples 'Reports - HOME address restrictions due to GDPR' do
  let(:work_address) { user.company.address.line }
  let(:home_address) { user.home_address.line }
  let(:order)        { wait_for { bookings_report_page.bookings.first }.tap(&:expand) }

  before { login_to_app_as(user.email) }

  it 'can see HOME address as Pickup Address' do
    create(:booking,
      :cancelled,
      passenger: user,
      pickup_address: user.home_address,
      pickup_passenger_address_type: 'home',
      destination_address: user.work_address,
      destination_passenger_address_type: 'work')
    bookings_report_page.load
    wait_until_true { bookings_report_page.loaded? }
    expect(order).to have_journey(text: "#{home_address} #{work_address}")
    order.open_details
    order.details.repeat_booking.click
    wait_until_true { edit_booking_page.loaded? }
    expect(edit_booking_page.pickup_address.selected_options).to eql(home_address)
  end

  it 'can see HOME address as Destination Address' do
    create(:booking,
      :cancelled,
      passenger: user,
      pickup_address: user.work_address,
      pickup_passenger_address_type: 'work',
      destination_address: user.home_address,
      destination_passenger_address_type: 'home')
    bookings_report_page.load
    expect(order).to have_journey(text: "#{work_address} #{home_address}")
    order.open_details
    order.details.repeat_booking.click
    wait_until_true { edit_booking_page.loaded? }
    expect(edit_booking_page.destination_address.selected_options).to eql(home_address)
  end
end

RSpec.shared_examples 'Reports - HOME address restrictions due to GDPR for Another Passenger' do
  let!(:another_user) { create(:passenger, :with_home_address, company: company) }
  let(:work_address)  { user.company.address.line }
  let(:home_address)  { user.home_address.line }
  let(:order)         { wait_for { bookings_report_page.bookings.first } }

  before { login_to_app_as(user.email) }

  it 'can not see HOME address as Pickup Address for another Passenger' do
    create(:booking,
      :cancelled,
      passenger: another_user,
      pickup_address: another_user.home_address,
      pickup_passenger_address_type: 'home',
      destination_address: user.work_address,
      destination_passenger_address_type: 'work')
    bookings_report_page.load
    wait_until_true { bookings_report_page.loaded? }
    expect(order).to have_journey(text: "Home #{work_address}")
    order.open_details
    order.details.repeat_booking.click
    wait_until_true { edit_booking_page.loaded? }
    expect(edit_booking_page.pickup_address.selected_options).to eql('Home')
  end

  it 'can not see HOME address as Destination Address for another Passenger' do
    create(:booking,
      :cancelled,
      passenger: another_user,
      pickup_address: another_user.work_address,
      pickup_passenger_address_type: 'work',
      destination_address: another_user.home_address,
      destination_passenger_address_type: 'home')
    bookings_report_page.load
    wait_until_true { bookings_report_page.loaded? }
    expect(order).to have_journey(text: "#{work_address} Home")
    order.open_details
    order.details.repeat_booking.click
    wait_until_true { edit_booking_page.loaded? }
    expect(edit_booking_page.destination_address.selected_options).to eql('Home')
  end
end
