require 'rails_helper'
require 'support/shared_examples/service_examples'

RSpec.describe Vehicles::Hide do
  describe '#execute!' do
    subject { described_class.new(current_user, params) }
    let(:current_user) { create(:user) }

    let(:vehicle) { create :vehicle, user: current_user }

    let(:params) do
      {
        vehicle_id: vehicle.id
      }
    end

    include_examples 'it uses policy', VehiclePolicy, :hide?

    it 'does not hide last visible vehicle' do
      expect { subject.execute! }.not_to change { current_user.vehicles.hidden.count }
      expect(subject).not_to be_success
      expect(subject.errors).to eq({ base: 'At least one vehicle should remain' })
    end

    context 'when driver has another visible vehicle' do
      let!(:another_vehicle) { create :vehicle, user: current_user }

      it 'hide vehicle' do
        expect { subject.execute! }.to change { current_user.vehicles.hidden.count }.by(1)
        expect(subject).to be_success
      end
    end
  end
end
