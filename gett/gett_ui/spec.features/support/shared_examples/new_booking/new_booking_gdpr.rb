RSpec.shared_examples 'HOME address restrictions due to GDPR' do
  let(:work_address) { user.company.address.line }
  let(:home_address) { user.home_address.line }
  let(:new_order)    { wait_for { bookings_page.bookings.first } }

  before do
    login_to_app_as(user.email)
    new_booking_page.load
  end

  it 'can see HOME address as Pickup Address' do
    new_booking_page.i_am_passenger.click unless user.passenger?
    new_booking_page.home_to_work_button.click
    expect(new_booking_page.pickup_address.selected_options).to eql(home_address)
    expect(new_booking_page.destination_address.selected_options).to eql(work_address)
    new_booking_page.vehicles.wait_until_available
    new_booking_page.save_button.click

    wait_until_true { bookings_page.loaded? }
    expect(new_order).to have_journey(text: "#{home_address} #{work_address}")
  end

  it 'can see HOME address as Destination Address' do
    new_booking_page.i_am_passenger.click unless user.passenger?
    new_booking_page.work_to_home_button.click
    expect(new_booking_page.pickup_address.selected_options).to eql(work_address)
    expect(new_booking_page.destination_address.selected_options).to eql(home_address)
    new_booking_page.vehicles.wait_until_available
    new_booking_page.save_button.click

    wait_until_true { bookings_page.loaded? }
    expect(new_order).to have_journey(text: "#{work_address} #{home_address}")
  end
end

RSpec.shared_examples 'HOME address restrictions due to GDPR for Another Passenger' do
  let!(:another_user) { create(:passenger, :with_home_address, company: company) }
  let(:work_address)  { user.company.address.line }
  let(:home_address)  { user.home_address.line }
  let(:new_order)     { wait_for { bookings_page.bookings.first } }

  before do
    login_to_app_as(user.email)
    new_booking_page.load
  end

  it 'can not see HOME address as Pickup Address for another Passenger' do
    new_booking_page.passenger_name.select(another_user.full_name)
    new_booking_page.home_to_work_button.click
    expect(new_booking_page.pickup_address.selected_options).to eql('Home')
    expect(new_booking_page.destination_address.selected_options).to eql(work_address)
    new_booking_page.vehicles.wait_until_available
    new_booking_page.save_button.click

    wait_until_true { bookings_page.loaded? }
    expect(new_order).to have_journey(text: "Home #{work_address}")
  end

  it 'can not see HOME address as Destination Address for another Passenger' do
    new_booking_page.passenger_name.select(another_user.full_name)
    new_booking_page.work_to_home_button.click
    expect(new_booking_page.pickup_address.selected_options).to eql(work_address)
    expect(new_booking_page.destination_address.selected_options).to eql('Home')
    new_booking_page.vehicles.wait_until_available
    new_booking_page.save_button.click

    wait_until_true { bookings_page.loaded? }
    expect(new_order).to have_journey(text: "#{work_address} Home")
  end
end
