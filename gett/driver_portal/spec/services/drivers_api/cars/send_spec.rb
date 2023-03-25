require 'rails_helper'
require 'support/shared_examples/service_examples'

RSpec.describe DriversApi::Cars::Send do
  describe '#execute!' do
    subject { described_class.new(current_user, params) }
    let(:current_user) { create(:user, :with_site_admin_role) }

    let(:vehicle) { create :vehicle }

    let(:params) do
      {
        vehicle: vehicle
      }
    end

    it 'search for existing car' do
      stub_service(DriversApi::Cars::Assign)
      expect(DriversApi::Cars::Search).to receive(:new)
        .with(current_user, { license: vehicle.plate_number })
        .and_return(instance_double(DriversApi::Cars::Search, execute!: true, success?: true, car_id: 1))
      subject.execute!
    end

    context 'when car already exist in GT' do
      before { stub_service(DriversApi::Cars::Search, car_id: 1) }

      it 'assign existing car ID to vehicle' do
        stub_service(DriversApi::Cars::Assign)
        subject.execute!
        expect(subject).to be_success
        expect(vehicle.reload.gett_id).to eq(1)
      end

      it 'does not try to create a car' do
        stub_service(DriversApi::Cars::Assign)
        expect(DriversApi::Cars::Create).not_to receive(:new)
        subject.execute!
      end

      it 'assigns car to driver' do
        expect(DriversApi::Cars::Assign).to receive(:new)
          .with(current_user, { vehicle: vehicle })
          .and_return(instance_double(DriversApi::Cars::Assign, execute!: true, success?: true))
        subject.execute!
      end
    end

    context 'when car not exist in GT' do
      before { stub_service(DriversApi::Cars::Search, car_id: nil) }

      it 'creates new car' do
        stub_service(DriversApi::Cars::Assign)
        expect(DriversApi::Cars::Create).to receive(:new)
          .with(current_user, { vehicle: vehicle })
          .and_return(instance_double(DriversApi::Cars::Create, execute!: true, success?: true, car_id: 2))
        subject.execute!
      end

      context 'when car created' do
        before { stub_service(DriversApi::Cars::Search, car_id: 2) }

        it 'assign existing car ID to vehicle' do
          stub_service(DriversApi::Cars::Assign)
          subject.execute!
          expect(subject).to be_success
          expect(vehicle.reload.gett_id).to eq(2)
        end

        it 'assigns car to driver' do
          expect(DriversApi::Cars::Assign).to receive(:new)
            .with(current_user, { vehicle: vehicle })
            .and_return(instance_double(DriversApi::Cars::Assign, execute!: true, success?: true))
          subject.execute!
        end
      end
    end
  end
end
