require 'rails_helper'

RSpec.describe System::SyncDrivers::All do
  describe '#execute!' do
    let(:current_user) { create(:user, :with_system_admin_role) }

    subject { described_class.new(current_user) }

    context 'when fleet service executed successfully' do
      before(:each) do
        stub_service(System::SyncDrivers::Fleet::List)
      end

      it 'executes successfully' do
        subject.execute!
        expect(subject.success?).to be_truthy
      end

      it 'notifies SyncManager' do
        expect(SyncManager).to receive(:sync_started!)
        expect(SyncManager).to receive(:sync_succeeded!)
        subject.execute!
      end
    end

    context 'when fleet service failed' do
      before(:each) do
        stub_service(System::SyncDrivers::Fleet::List, false)
      end

      it 'should fail' do
        subject.execute!
        expect(subject.success?).not_to be_truthy
      end

      it 'notifies SyncManager' do
        expect(SyncManager).to receive(:sync_started!)
        expect(SyncManager).to receive(:sync_failed!)
        subject.execute!
      end
    end
  end
end
