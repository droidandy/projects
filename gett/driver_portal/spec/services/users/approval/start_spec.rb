require 'rails_helper'
require 'support/shared_examples/service_examples'

RSpec.describe Users::Approval::Start do
  describe '#execute!' do
    subject { described_class.new(current_user) }
    let(:current_user) { create(:user, :with_site_admin_role) }

    context 'with users in queue' do
      include_examples 'it uses policy', Users::ApprovalPolicy, :start?

      let!(:user_1) { create :user, :with_driver_role, ready_for_approval_since: Time.current - 1.hour }
      let!(:user_2) { create :user, :with_driver_role, ready_for_approval_since: Time.current - 3.hour }
      let!(:already_approving_user) { create :user, :with_driver_role, :being_approved, ready_for_approval_since: Time.current - 5.hour }
      let!(:user_not_in_queue) { create :user }

      it 'picks user with earliest timestamp for approval' do
        subject.execute!
        expect(subject).to be_success
        expect(user_2.reload.approver_id).to eq(current_user.id)
      end

      it 'does not touch other users' do
        subject.execute!
        expect(subject).to be_success
        expect(user_1.reload.approver_id).not_to eq(current_user.id)
        expect(user_not_in_queue.reload.approver_id).not_to eq(current_user.id)
        expect(already_approving_user.reload.approver_id).not_to eq(current_user.id)
      end

      context 'when another user is being approved by current user' do
        let!(:another_user_being_approved) { create :user, :with_driver_role, approver: current_user }

        it 'fails' do
          subject.execute!
          expect(subject).not_to be_success
          expect(subject.errors).to eq({ base: 'Another user is being approved by you' })
        end
      end
    end

    context 'with empty queue' do
      it 'fails' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to eq({ base: 'Queue is empty' })
      end
    end
  end
end
