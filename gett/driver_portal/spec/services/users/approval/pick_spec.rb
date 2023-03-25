require 'rails_helper'
require 'support/shared_examples/service_examples'

RSpec.describe Users::Approval::Pick do
  describe '#execute!' do
    subject { described_class.new(current_user, params) }
    let(:current_user) { create(:user, :with_site_admin_role) }

    let(:user) { create :user, :with_driver_role }

    let(:params) do
      {
        user_id: user.id
      }
    end

    include_examples 'it uses policy', UserPolicy, :pick_for_approval?

    it 'should work' do
      subject.execute!
      expect(subject).to be_success
    end

    it 'creates record' do
      subject.execute!
      expect(user.reload.approver_id).to eq(current_user.id)
    end

    context 'when user is already claimed' do
      let(:user) { create :user, :with_driver_role, :being_approved }

      it 'fails' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to eq({ user: 'is being approved already' })
      end
    end

    context 'when another user is being approved by current user' do
      let!(:another_user_being_approved) { create :user, approver: current_user }

      it 'fails' do
        subject.execute!
        expect(subject).not_to be_success
        expect(subject.errors).to eq({ base: 'Another user is being approved by you' })
      end
    end
  end
end
