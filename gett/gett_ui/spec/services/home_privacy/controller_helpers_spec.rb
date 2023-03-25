require 'rails_helper'

RSpec.describe HomePrivacy::ControllerHelpers do
  let(:helpers) { Object.new.extend(HomePrivacy::ControllerHelpers) }

  describe '#restore_address_params!' do
    before { helpers.send(:restore_address_params!, params) }

    context 'when id is present in params' do
      let(:address) { create(:address) }
      let(:params)  { {id: address.id, lat: 1, lng: 2}.with_indifferent_access }

      it 'merges address data into params' do
        expect(params.values_at(:lat, :lng)).to eq(address.values.values_at(:lat, :lng))
        expect(params).to include('postal_code', 'line', 'country_code', 'timezone', 'city')
      end
    end
  end
end
