require 'rails_helper'

RSpec.describe GoogleApi::AddressNormalizer, type: :service do
  describe '#normalize' do
    subject(:normalized_address) { described_class.normalize(address_details) }

    context 'when address is not an airport' do
      let(:address_details) { JSON.parse(Rails.root.join('spec/fixtures/google_api/address_details/address_response.json').read) }

      its([:airport_iata]) { is_expected.to be_nil }
    end

    context 'when address is an airport' do
      let(:address_details) { JSON.parse(Rails.root.join('spec/fixtures/google_api/address_details/airport_response.json').read) }

      before { create(:airport, lat: 51.5048437, lng: 0.049518, iata: 'LCY') }

      its([:airport_iata]) { is_expected.to eq('LCY') }
    end

    context 'when address contains short postal code' do
      let(:address_details) { JSON.parse(Rails.root.join('spec/fixtures/google_api/address_details/short_post_code_response.json').read) }

      before do
        stub_request(:get, %r(https://api.addressy.com/Geocoding/UK/ReverseGeocode/v1.10/json3.ws))
          .to_return(status: 200, body: Rails.root.join('spec/fixtures/loqate/reverse_geocoder_response.json').read)
      end

      its([:postal_code]) { is_expected.to eq('EC4A 1AN') }
    end
  end
end
