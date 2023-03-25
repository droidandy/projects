require 'rails_helper'

RSpec.describe GoogleApi::EmailStaticMap, type: :service do
  let(:booking)   { create(:booking) }
  let(:service)   { GoogleApi::EmailStaticMap.new(booking: booking) }
  let(:direction) { Hashie::Mash.new(direction: 'direction_path') }

  describe 'execution result' do
    before { allow(GoogleApi).to receive(:fetch_direction).and_return(direction) }

    subject(:result) { service.execute.result }

    it 'includes address coordinates' do
      expect(result).to include(booking.pickup_address.lat.to_s)
        .and include(booking.pickup_address.lng.to_s)
        .and include(booking.destination_address.lat.to_s)
        .and include(booking.destination_address.lng.to_s)
    end

    it 'includes signature' do
      expect(result).to include('signature') & include('client')
    end

    describe 'path' do
      subject(:path) { result[/path=([^&]+)/] }

      context 'when booking driver has multiple path points' do
        let(:address) { create(:address, lat: 51.492558, lng: 0.018686) }
        let(:booking) { create(:booking, stop_addresses: [address]) }

        let(:path_points) { [[51.514892, -0.089652], [51.514102, -0.089427], [51.52, -0.0891]] }
        before { create(:booking_driver, path_points: path_points, booking: booking) }

        it 'does not include booking stop points, but includes driver path points instead' do
          expect(path).not_to include(address.lat.to_s)

          path_points.each do |lat, lng|
            expect(path).to include(lat.to_s).and include(lng.to_s)
          end
        end
      end
    end

    describe 'markers' do
      context 'when there are 3 or less stop addresses' do
        let(:address) { create(:address, lat: 51.492558, lng: 0.018686) }
        let(:booking) { create(:booking, stop_addresses: [address]) }

        it 'includes stop point coordinates and proper icon' do
          expect(result).to include(address.lat.to_s)
            .and include(address.lng.to_s)
            .and include('stop-point-1-small-size')
        end
      end

      context 'when booking has over 3 stop addresses' do
        let(:stop_addresses) { create_list(:address, 4) }
        let(:booking)        { create(:booking, stop_addresses: stop_addresses) }

        it 'users default marker icon for all of them' do
          expect(result.scan(/stop-point-default-small-size/).size).to eq(4)
        end
      end
    end
  end
end
