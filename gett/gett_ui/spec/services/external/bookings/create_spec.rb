require 'rails_helper'

RSpec.describe External::Bookings::Create, type: :service do
  let(:company) { create(:company) }
  let(:admin)   { create(:admin, company: company) }

  service_context { {user: admin, company: company} }

  describe '#execute' do
    subject(:service) { described_class.new(params: params) }

    let(:vehicle) { create(:vehicle, :gett) }
    let(:params) do
      {
        vehicle_value: vehicle.value,
        passenger_name: 'John Smith',
        passenger_phone: '+79998886655',
        international_flag: true,
        scheduled_at: (90.minutes.from_now).to_s,
        payment_method: 'account',
        pickup_address: { postal_code: 'NW11 9UA', lat: '51.5766877', lng: '-0.2156368', line: 'Pickup', country_code: 'GB', city: 'London' },
        destination_address: { postal_code: 'HA8 6EY', lat: '51.6069082', lng: '-0.2816665', line: 'Setdown', country_code: 'GB', city: 'London' },
        stops: [
          {
            name: 'Bob',
            phone: '777888666555',
            address: { postal_code: 'NW9 5LL', lat: '51.6039763', lng: '-0.2705515', line: 'Stop point', country_code: 'GB', city: 'London' }
          }
        ],
        vehicle_price: 1000,
        as_directed: false
      }
    end

    before do
      stub_request(:get, %r(https://maps.googleapis.com/maps/api/distancematrix))
        .to_return(status: 200, body: Rails.root.join('spec/fixtures/distance_response_in_miles.json').read)

      stub_request(:get, %r(https://maps.googleapis.com/maps/api/geocode/json?.*latlng=[\-\d\.]+,[\-\d\.]+.*))
        .to_return(status: 200, body: Rails.root.join('spec/fixtures/google_api/reverse_geocode/admin_area_level_1_response.json').read)

      allow(Faye.bookings).to receive(:notify_create)
    end

    it 'reverse geocodes addresses and assigns geocoded address lines' do
      service.execute

      expect(service.booking.pickup_address.line).to eq('277 Bedford Avenue, Brooklyn, NY 11211, USA')
      expect(service.booking.destination_address.line).to eq('277 Bedford Avenue, Brooklyn, NY 11211, USA')
      expect(service.booking.stop_addresses.map(&:line)).to eq(['277 Bedford Avenue, Brooklyn, NY 11211, USA'])
    end
  end
end
