require 'rails_helper'

RSpec.describe System::SyncDrivers::Fleet::One do
  describe '#execute!' do
    context 'with two drivers' do
      let(:body) { json_body('gett/fleet_api/driver') }
      let(:gett_id) { 10 }

      let!(:current_user) { create(:user, :with_system_admin_role) }

      subject { described_class.new(current_user, params) }

      let(:params) do
        {
          driver_id: gett_id
        }
      end

      before(:each) do
        stub_client(GettFleetApi::Client, :driver, body, response_class: GettFleetApi::Response)
        allow_any_instance_of(BaseUploader).to receive(:download!)
      end

      it 'executes successfully' do
        subject.execute!
        expect(subject).to be_success
      end

      context 'with existing user' do
        let!(:user) { create :user, :with_driver_role, gett_id: gett_id }

        it 'updates existing user' do
          subject.execute!
          expect(user.reload.name).to eq('Mark Williams')
        end
      end

      context 'with new user' do
        it 'creates new user' do
          expect { subject.execute! }.to change { User.count }.by(1)
          expect(User.last.gett_id).to eq gett_id
          expect(User.last.roles.map(&:name)).to include('driver')
        end
      end
    end
  end
end
