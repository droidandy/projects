require 'rails_helper'
require 'support/shared_examples/service_examples'

RSpec.describe Vehicles::SetCurrent do
  describe '#execute!' do
    subject { described_class.new(current_user, params) }
    let(:current_user) { create(:user) }

    let(:vehicle) { create :vehicle, user: current_user }

    let(:params) do
      {
        vehicle_id: vehicle.id
      }
    end

    include_examples 'it uses policy', VehiclePolicy, :set_current?

    before(:each) do
      stub_client(GettDriversApi::Client, :update_driver, {}.to_json)
    end

    it 'should work' do
      subject.execute!
      expect(subject).to be_success
    end

    it 'makes vehicle default one' do
      subject.execute!
      expect(vehicle.reload.is_current).to eq(true)
    end

    context 'with more then one vehicle' do
      let!(:other_vehicles) { create_list :vehicle, 2, user: current_user, is_current: true }

      it 'unmark previous current vehicle' do
        subject.execute!
        expect(current_user.vehicles.count).to eq(3)
        expect(current_user.vehicles.where(is_current: true).count).to eq(1)
      end
    end

    context 'with already current vehicle' do
      let(:vehicle) { create :vehicle, user: current_user, is_current: true }

      it 'is still should be current' do
        subject.execute!
        expect(vehicle.reload.is_current).to eq(true)
      end
    end

    context 'with invalid vehicle id' do
      let(:params) do
        {
          vehicle_id: 0
        }
      end

      it 'fails' do
        expect { subject.execute! }.to raise_error ActiveRecord::RecordNotFound
      end
    end
  end
end
