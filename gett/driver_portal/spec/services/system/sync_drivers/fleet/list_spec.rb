require 'rails_helper'

RSpec.describe System::SyncDrivers::Fleet::List do
  describe '#execute!' do
    context 'with two drivers' do
      let(:body) { json_body('gett/fleet_api/drivers') }
      let!(:user) { create :user, :with_driver_role, gett_id: 3361 }

      let!(:current_user) { create(:user, :with_system_admin_role) }

      subject { described_class.new(current_user) }

      before(:each) do
        stub_client(GettFleetApi::Client, :drivers, body, response_class: GettFleetApi::Response)
        allow_any_instance_of(BaseUploader).to receive(:download!)
      end

      it 'executes successfully' do
        subject.execute!
        expect(subject).to be_success
      end

      it 'creates new user' do
        expect { subject.execute! }.to change { User.count }.by(1)
        expect(User.last.gett_id).to eq 10
        expect(User.last.roles.map(&:name)).to include('driver')
      end

      it 'updates existing user' do
        subject.execute!
        expect(user.reload.name).to eq('Glenn Milner')
      end
    end
  end
end
