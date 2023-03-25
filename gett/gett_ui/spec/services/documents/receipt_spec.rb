require 'rails_helper'

RSpec.describe Documents::Receipt, type: :service do
  let(:company) { create(:company) }
  let(:booking_reference) { create(:booking_reference, name: 'foo', company: company) }
  let(:passenger) { create(:passenger, company: company, first_name: 'john') }
  let(:service)   { described_class.new(booking_id: booking.id) }

  let!(:booker_reference) do
    create(:booker_reference,
      booking: booking,
      booking_reference_name: booking_reference.name,
      value: 'bar'
    )
  end

  let(:booking) do
    create(:booking,
      travel_reason: create(:travel_reason, name: 'Beach'),
      passenger: passenger,
      pickup_address: pickup_address,
      destination_address: destination_address,
      stop_addresses: [stop_address],
      started_at: Time.zone.parse('06/02/2018 14:28'),
      ended_at: Time.zone.parse('06/02/2018 14:48')
    )
  end

  let(:pickup_address)      { create(:address, timezone: 'Europe/Kiev', line: 'Pickup') }
  let(:destination_address) { create(:address, line: 'Destination') }
  let(:stop_address)        { create(:address, line: 'Stop') }
  let(:map_service)         { double(execute: double(result: 'map_image_url')) }

  before do
    allow(GoogleApi::CardReceiptStaticMap).to receive(:new).and_return(map_service)
    create(:booking_charges, paid_waiting_time: 900, handling_fee: 300, booking_fee: 145, run_in_fee: 700, tips: 432, booking: booking)
  end

  describe '#template_assigns' do
    subject { service.template_assigns }

    it do
      is_expected.to eq(
        booking: booking,
        passenger_name: 'John',
        ride_duration: "00:20:00",
        formatted_vehicle_type: booking.vehicle.name,
        pickup_address_line: 'Pickup',
        destination_address_line: 'Destination',
        stop_address_lines: ['Stop'],
        map_image_url: 'map_image_url',
        travel_reason: 'Beach',
        references: [{name: "foo", value: "bar"}, {name: nil, value: nil}, {name: nil, value: nil}, {name: nil, value: nil}],
        waiting_time: "00:15:00",
        started_at: '16:28, 06 February 2018',
        ended_at: '16:48, 06 February 2018',
        fare: "£ 0.00",
        fee: "£ 11.45",
        tips: "£ 4.32",
        total: "£ 0.00",
        vat: "£ 0.00"
      )
    end
  end
end
