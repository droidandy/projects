require 'rails_helper'

RSpec.describe Address, type: :model do
  describe 'validations' do
    it { is_expected.to validate_presence :line }
    it { is_expected.to validate_presence :lat }
    it { is_expected.to validate_presence :lng }
    it { is_expected.to validate_presence :country_code }
  end

  describe 'hooks' do
    it 'assigns timezone on before_create' do
      address = build(:address, line: 'foo', lat: 51.523762, lng: -0.158503, country_code: 'GB', point_of_interest: 'hotel')
      expect(Timezones).to receive(:timezone_at).with(address).and_return('Timezone')
      address.save!
      expect(address.reload.timezone).to eq('Timezone')
    end
  end

  describe '.lookup' do
    subject { Address.lookup(params) }

    context 'when params are empty' do
      let(:params) { {} }

      it { is_expected.to be nil }
    end

    context 'when params present' do
      let(:params) { {line: 'foo', lat: 1, lng: 2, country_code: 'GB', city: 'London', point_of_interest: 'hotel'} }

      context 'when such address exists' do
        let!(:address) { create(:address, params) }

        it { is_expected.to eq address }
      end

      context 'when such address does not exist' do
        it { is_expected.to be nil }
      end
    end
  end

  describe '.fetch' do
    let(:params) { {line: 'foo', lat: 1, lng: 2, country_code: 'GB', city: 'London', point_of_interest: 'hotel'} }

    subject { Address.fetch(params) }

    context 'when such address exists' do
      let!(:address) { create(:address, params) }

      it { is_expected.to eq address }
    end

    context 'when such address does not exist' do
      it { is_expected.to be_new }
      its(:values) { is_expected.to include params }
    end
  end

  describe '.lookup_valid!' do
    subject { Address.lookup_valid!(params) }

    context 'when id is present in params' do
      let(:address) { create(:address) }
      let(:params)  { {id: address.id} }

      it { is_expected.to eq(address) }
    end

    context 'when params are valid' do
      let(:params) { {line: 'foo', lat: 1, lng: 2, country_code: 'GB', city: 'London'} }

      context 'when such address exists' do
        let!(:address) { create(:address, params) }

        it { is_expected.to eq address }

        context 'when new values are present in params' do
          let(:extended_params) { params.merge(point_of_interest: 'hotel') }

          it "fetches existing address and populates it's missing attributes with data" do
            looked_up = nil

            expect{ looked_up = Address.lookup_valid!(extended_params) }
              .to change{ address.reload.point_of_interest }.from(nil).to('hotel')

            expect(looked_up.id).to eq address.id
          end
        end
      end

      context 'when such address does not exist' do
        it { is_expected.to be_persisted }

        its(:values) { is_expected.to include params }
      end
    end

    context 'when params are not valid' do
      let(:params) { {line: 'foo', lat: nil, lng: nil} }

      it { is_expected.to be_new }
    end
  end
end
