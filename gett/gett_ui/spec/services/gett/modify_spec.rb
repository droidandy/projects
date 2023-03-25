require 'rails_helper'

RSpec.describe Gett::Modify, type: :service do
  subject(:service) { described_class.new(booking: booking) }

  service_context { { company: booking.booker.company } }

  describe '#execute' do
    let(:address)      { create(:address, :baker_street) }
    let(:vehicle)      { create(:vehicle, :gett) }
    let(:booking)      { create(:booking, :scheduled, pickup_address: address, vehicle: vehicle, scheduled_at: 2.hours.from_now) }
    let(:stop_address) { create(:address) }

    before do
      booking.add_booking_address(
        address_id: stop_address.id,
        address_type: 'stop',
        stop_info: { name: 'Bob', phone: '+79998887766' }
      )
    end

    context 'when succeeds' do
      let(:ride_response) { Rails.root.join('spec/fixtures/gett/ride_response_modify.json').read }
      let(:response) { {status: 200, body: ride_response.to_json} }

      before do
        expect(Gett::Authenticate).to receive(:new).and_return(double(execute: true))

        expect(service).to receive(:params).and_return(double(to_json: 'params'))

        stub_request(:patch, "http://localhost/business/rides/service-id?business_id=TestBusinessId")
          .with(body: 'params')
          .to_return(response)

        service.execute
      end

      it { is_expected.to be_success }
      its('response.data') { is_expected.to eq ride_response }
    end

    specify '#params' do
      expect(service.send(:params)).to match(
        pickup: {
          latitude: booking.pickup_address.lat,
          longitude: booking.pickup_address.lng,
          address: booking.pickup_address.line
        },
        destination: {
          latitude: booking.destination_address.lat,
          longitude: booking.destination_address.lng,
          address: booking.destination_address.line
        },
        note_to_driver: 'Some message',
        product_id: 'product1',
        reference: booking.id.to_s,
        scheduled_at: booking.scheduled_at,
        stop_points: [
          {
            latitude: stop_address.lat,
            longitude: stop_address.lng,
            address: stop_address.line,
            name: 'Bob',
            phone_number: '+79998887766'
          }
        ]
      )
    end
  end
end
