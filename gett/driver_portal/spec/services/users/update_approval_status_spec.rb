require 'rails_helper'
require 'support/shared_examples/service_examples'

RSpec.describe Users::UpdateApprovalStatus do
  describe '#execute!' do
    subject { described_class.new(current_user, params) }
    let(:current_user) { create(:user, :with_site_admin_role) }

    let(:user) { create :user, :with_driver_role }

    let(:params) do
      {
        user: user
      }
    end

    let!(:optional_doc) { create :document, user: user, approval_status: :rejected }
    let!(:empty_optional_kind) { create :documents_kind, owner: :driver }
    let!(:vehicle_kind) { create :documents_kind, owner: :vehicle, mandatory: true }
    let!(:vehicle_doc) { create :document, :vehicle_bound, kind: vehicle_kind, user: user }

    context 'with all required documents approved' do
      let!(:doc_1) { create :document, :required, user: user, approval_status: :approved }
      let!(:doc_2) { create :document, :required, user: user, approval_status: :approved }
      let!(:doc_3) { create :document, :required, user: user, approval_status: :approved }

      it 'makes user approved' do
        subject.execute!
        expect(user.reload.approval_status).to eq('approved')
      end
    end

    context 'with rejected document' do
      let!(:doc_1) { create :document, :required, user: user, approval_status: :approved }
      let!(:doc_2) { create :document, :required, user: user, approval_status: :rejected }
      let!(:doc_3) { create :document, :required, user: user, approval_status: :pending }

      it 'makes user rejected' do
        subject.execute!
        expect(user.reload.approval_status).to eq('rejected')
      end
    end

    context 'with only approved and pending documents' do
      let!(:doc_1) { create :document, :required, user: user, approval_status: :approved }
      let!(:doc_2) { create :document, :required, user: user, approval_status: :approved }
      let!(:doc_3) { create :document, :required, user: user, approval_status: :pending }

      it 'makes user pending' do
        subject.execute!
        expect(user.reload.approval_status).to eq('pending')
      end
    end

    context 'with missing documents' do
      let!(:kinds) { create_list :documents_kind, 3, owner: :driver, mandatory: true }
      let!(:doc_1) { create :document, kind: kinds[0], user: user, approval_status: :pending }
      let!(:doc_2) { create :document, kind: kinds[1], user: user, approval_status: :pending }

      it 'marks user as with missing documents' do
        subject.execute!
        expect(user.reload.approval_status).to eq('documents_missing')
      end
    end
  end
end
