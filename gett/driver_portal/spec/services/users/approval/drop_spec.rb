require 'rails_helper'
require 'support/shared_examples/service_examples'

RSpec.describe Users::Approval::Drop do
  describe '#execute!' do
    subject { described_class.new(current_user, params) }
    let(:current_user) { create(:user, :with_site_admin_role) }

    let(:user) { create :user, :with_driver_role, :being_approved }

    let(:params) do
      {
        user_id: user.id
      }
    end

    include_examples 'it uses policy', Users::ApprovalPolicy, :drop?

    it 'should work' do
      subject.execute!
      expect(subject).to be_success
    end

    it 'removes approval claim from user' do
      subject.execute!
      expect(user.reload.approver_id).to be_nil
    end
  end
end
