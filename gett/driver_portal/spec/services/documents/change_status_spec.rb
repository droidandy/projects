require 'rails_helper'
require 'support/shared_examples/service_examples'

RSpec.describe Documents::ChangeStatus do
  describe '#execute!' do
    subject { described_class.new(current_user, params) }
    let(:current_user) { create(:user, :with_site_admin_role) }

    let(:document) { create :document }

    let(:params) do
      {
        document: document,
        status: 'approved',
        comment: 'Comment'
      }
    end

    context 'when document is vehicle-bound' do
      let(:kind) { create :documents_kind, owner: :vehicle, mandatory: true }
      let(:document) { create :document, :vehicle_bound, kind: kind }

      it 'should call vehicle status recalculation' do
        expect(Vehicles::UpdateApprovalStatus).to receive(:new)
          .with(current_user, { vehicle: document.vehicle })
          .and_return(instance_double(Vehicles::UpdateApprovalStatus, execute!: true, success?: true))
        subject.execute!
        expect(subject).to be_success
      end

      context 'with stubbed service' do
        before(:each) do
          stub_service(Vehicles::UpdateApprovalStatus)
        end

        it 'creates status change record' do
          expect { subject.execute! }.to change { document.status_changes.count }.by(1)
          expect(subject.status_change.document).to eq(document)
          expect(subject.status_change.user).to eq(current_user)
          expect(subject.status_change.status).to eq('approved')
          expect(subject.status_change.comment).to eq('Comment')
          expect(subject).to be_success
        end

        it 'assign valid attributes' do
          subject.execute!
          expect(subject).to be_success
          expect(subject.updated_document.approval_status).to eq('approved')
        end

        it 'should call queue checking service for user' do
          expect(Users::CheckQueueStatus).to receive(:new)
            .with(current_user, { user: document.user })
            .and_return(instance_double(Users::CheckQueueStatus, execute!: true, success?: true))
          subject.execute!
          expect(subject).to be_success
        end
      end

      context 'when document is optional' do
        let(:kind) { create :documents_kind, owner: :vehicle, mandatory: false }
        let(:document) { create :document, :vehicle_bound, kind: kind }

        it 'does not call vehicle status recalculation' do
          expect(Vehicles::UpdateApprovalStatus).not_to receive(:new)
          subject.execute!
          expect(subject).to be_success
        end
      end
    end

    context 'when document is driver-bound' do
      let(:kind) { create :documents_kind, owner: :driver, mandatory: true }
      let(:document) { create :document, kind: kind }

      it 'should call vehicle status recalculation' do
        expect(Users::UpdateApprovalStatus).to receive(:new)
          .with(current_user, { user: document.user })
          .and_return(instance_double(Users::UpdateApprovalStatus, execute!: true, success?: true))
        subject.execute!
        expect(subject).to be_success
      end

      context 'with stubbed service' do
        before(:each) do
          stub_service(Users::UpdateApprovalStatus)
        end

        it 'creates status change record' do
          expect { subject.execute! }.to change { document.status_changes.count }.by(1)
          expect(subject).to be_success
          expect(subject.status_change.document).to eq(document)
          expect(subject.status_change.user).to eq(current_user)
          expect(subject.status_change.status).to eq('approved')
          expect(subject.status_change.comment).to eq('Comment')
        end

        it 'assign valid attributes' do
          subject.execute!
          expect(subject).to be_success
          expect(subject.updated_document.approval_status).to eq('approved')
        end

        it 'should call queue checking service for user' do
          expect(Users::CheckQueueStatus).to receive(:new)
            .with(current_user, { user: document.user })
            .and_return(instance_double(Users::CheckQueueStatus, execute!: true, success?: true))
          subject.execute!
          expect(subject).to be_success
        end
      end

      context 'when document is optional' do
        let(:kind) { create :documents_kind, owner: :driver, mandatory: false }
        let(:document) { create :document, kind: kind }

        it 'does not call vehicle status recalculation' do
          expect(Users::UpdateApprovalStatus).not_to receive(:new)
          subject.execute!
          expect(subject).to be_success
        end
      end
    end
  end
end
