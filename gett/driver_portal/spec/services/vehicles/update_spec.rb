require 'rails_helper'
require 'support/shared_examples/service_examples'

RSpec.describe Vehicles::Update do
  describe '#execute!' do
    subject { described_class.new(current_user, params) }
    let(:current_user) { create(:user) }

    let!(:another_vehicle) { create :vehicle }
    let(:vehicle) { create :vehicle, user: current_user, title: 'Old title', model: 'Old model' }
    let(:vehicle_id) { vehicle.id }

    let(:params) do
      {
        vehicle_id: vehicle_id,
        title: 'New title',
        model: 'New model'
      }
    end

    include_examples 'it uses policy', VehiclePolicy, :update?

    it 'should work' do
      subject.execute!
      expect(subject).to be_success
    end

    it 'assign valid attributes' do
      subject.execute!
      expect(subject.updated_vehicle.title).to eq('New title')
      expect(subject.updated_vehicle.model).to eq('New model')
    end

    context 'with nil attributes' do
      let(:params) do
        {
          vehicle_id: vehicle.id
        }
      end

      it 'does not erase old attributes' do
        subject.execute!
        expect(subject).to be_success
        expect(subject.updated_vehicle.title).to eq('Old title')
        expect(subject.updated_vehicle.model).to eq('Old model')
      end
    end

    context 'with invalid vehicle id' do
      let(:vehicle_id) { 0 }

      it 'fails' do
        expect { subject.execute! }.to raise_error(ActiveRecord::RecordNotFound)
      end
    end
  end
end
