require 'rails_helper'

RSpec.describe DriversApi::SendWholeDriver do
  subject { described_class.new(params) }

  let(:driver) { create :user, :with_apollo_driver_role }
  let!(:driver_documents) { create_list :document, 2, :approved, user: driver }
  let!(:vehicles) { create_list :vehicle, 2, approval_status: :approved, user: driver }
  let!(:vehicle_1_documents) { create_list :document, 2, :approved, user: driver, vehicle: vehicles[0] }
  let!(:vehicle_2_documents) { create_list :document, 2, :approved, user: driver, vehicle: vehicles[1] }

  let(:params) do
    {
      driver: driver
    }
  end

  context 'when driver sent successfully' do
    before { stub_service(DriversApi::Drivers::Send) }

    context 'when documents sent successfully' do
      before { stub_service(DriversApi::Documents::Send) }

      context 'when vehicle sent successfully' do
        before { stub_service(DriversApi::Cars::Send) }

        it 'works' do
          subject.execute!
          expect(subject).to be_success
        end
      end

      context 'when documents sending failed' do
        before { stub_service(DriversApi::Cars::Send, false) }

        it 'fails' do
          subject.execute!
          expect(subject).not_to be_success
        end
      end
    end

    context 'when documents sending failed' do
      before { stub_service(DriversApi::Documents::Send, false) }

      it 'fails' do
        subject.execute!
        expect(subject).not_to be_success
      end
    end
  end

  context 'when driver sending failed' do
    before { stub_service(DriversApi::Drivers::Send, false) }

    it 'fails' do
      subject.execute!
      expect(subject).not_to be_success
    end
  end
end
