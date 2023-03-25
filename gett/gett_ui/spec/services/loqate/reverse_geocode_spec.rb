require 'rails_helper'

RSpec.describe Loqate::ReverseGeocode, type: :service do
  describe 'execution' do
    let(:lat)     { 51.5163977 }
    let(:lng)     { -0.1078264 }
    let(:service) { described_class.new(lat: lat, lng: lng) }

    before do
      stub_request(:get, %r(https://api.addressy.com/Geocoding/UK/ReverseGeocode/v1.10/json3.ws))
        .to_return(status: 200, body: Rails.root.join('spec/fixtures/loqate/reverse_geocoder_response.json').read)
    end

    it 'fetches normalized items' do
      expect(service.execute.result).to eq([
        post_code: "EC4A 1AN",
        distance: 36.1,
        lat: 51.5167198181152,
        lng: -0.107790179550648
      ])
    end

    context 'when :closest attribute is used' do
      let(:service) { described_class.new(lat: lat, lng: lng, closest: true) }

      it 'fetches one closest item' do
        expect(service.execute.result).to eq(
          post_code: "EC4A 1AN",
          distance: 36.1,
          lat: 51.5167198181152,
          lng: -0.107790179550648
        )
      end
    end
  end
end
