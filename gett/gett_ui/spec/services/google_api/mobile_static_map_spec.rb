require 'rails_helper'

RSpec.describe GoogleApi::MobileStaticMap, type: :service do
  let(:booking)   { create(:booking) }
  let(:service)   { GoogleApi::MobileStaticMap.new(booking: booking) }
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

    it 'includes encoded_polyline' do
      expect(result).to include('enc:direction_path')
    end

    it "doesn't include signature" do
      expect(result).not_to include('signature')
      expect(result).not_to include('client')
    end

    context 'as directed bookings' do
      let(:booking) { create(:booking, destination_address: false) }

      it "executes successfully" do
        expect(service.execute).to be_success
      end
    end

    describe 'markers' do
      let(:address) { create(:address, lat: 51.492558, lng: 0.018686) }
      let(:booking) { create(:booking, stop_addresses: [address]) }

      it 'includes stop point coordinates and proper icon' do
        expect(result).to include(address.lat.to_s)
          .and include(address.lng.to_s)
          .and include('mobile_stop_point_marker')
      end
    end
  end
end
