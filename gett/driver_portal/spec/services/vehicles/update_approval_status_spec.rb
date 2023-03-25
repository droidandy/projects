require 'rails_helper'
require 'support/shared_examples/service_examples'

RSpec.describe Vehicles::UpdateApprovalStatus do
  describe '#execute!' do
    subject { described_class.new(current_user, params) }
    let(:current_user) { create(:user, :with_site_admin_role) }

    let(:user) { create :user, :with_driver_role }
    let(:vehicle) { create :vehicle, user: user, approval_status: :pending }

    let(:params) do
      {
        vehicle: vehicle
      }
    end

    let!(:optional_doc) { create :document, user: user, vehicle: vehicle, approval_status: :rejected }
    let!(:empty_optional_kind) { create :documents_kind, owner: :vehicle }

    context 'with all required documents approved' do
      let!(:doc_1) { create :document, :required, user: user, vehicle: vehicle, approval_status: :approved }
      let!(:doc_2) { create :document, :required, user: user, vehicle: vehicle, approval_status: :approved }
      let!(:doc_3) { create :document, :required, user: user, vehicle: vehicle, approval_status: :approved }

      it 'makes vehicle approved' do
        subject.execute!
        expect(vehicle.reload.approval_status).to eq('approved')
      end
    end

    context 'with rejected document' do
      let!(:doc_1) { create :document, :required, user: user, vehicle: vehicle, approval_status: :approved }
      let!(:doc_2) { create :document, :required, user: user, vehicle: vehicle, approval_status: :rejected }
      let!(:doc_3) { create :document, :required, user: user, vehicle: vehicle, approval_status: :pending }

      it 'makes vehicle rejected' do
        subject.execute!
        expect(vehicle.reload.approval_status).to eq('rejected')
      end
    end

    context 'with only approved and pending documents' do
      let!(:doc_1) { create :document, :required, user: user, vehicle: vehicle, approval_status: :approved }
      let!(:doc_2) { create :document, :required, user: user, vehicle: vehicle, approval_status: :approved }
      let!(:doc_3) { create :document, :required, user: user, vehicle: vehicle, approval_status: :pending }

      it 'makes vehicle pending' do
        subject.execute!
        expect(vehicle.reload.approval_status).to eq('pending')
      end
    end

    context 'with missing documents' do
      let!(:kinds) { create_list :documents_kind, 3, owner: :vehicle, mandatory: true }
      let!(:doc_1) { create :document, kind: kinds[0], user: user, vehicle: vehicle, approval_status: :pending }
      let!(:doc_2) { create :document, kind: kinds[1], user: user, vehicle: vehicle, approval_status: :pending }

      it 'marks vehicle as with missing documents' do
        subject.execute!
        expect(vehicle.reload.approval_status).to eq('documents_missing')
      end
    end
  end
end
