require 'rails_helper'

RSpec.describe Vehicle, type: :model do
  describe 'validations' do
    it { is_expected.to validate_presence :name }
    it { is_expected.to validate_presence :value }
    it { is_expected.to validate_presence :service_type }
  end

  describe '#allow_quote?' do
    context 'when there is ot provider' do
      let(:vehicle) { create(:vehicle, :one_transport) }

      it 'returns true' do
        expect(vehicle.allow_quote?).to be true
      end
    end

    context 'when there is get_e provider' do
      let(:vehicle) { create(:vehicle, :get_e) }

      it 'returns true' do
        expect(vehicle.allow_quote?).to be true
      end
    end

    context 'when there is carey provider' do
      let(:vehicle) { create(:vehicle, :carey) }

      it 'returns true' do
        expect(vehicle.allow_quote?).to be true
      end
    end

    context 'when there is splyt provider' do
      let(:vehicle) { create(:vehicle, :splyt) }

      it 'returns true' do
        expect(vehicle.allow_quote?).to be true
      end
    end
  end
end
