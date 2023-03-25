require 'rails_helper'
require 'support/shared_examples/service_examples'

RSpec.describe Users::CheckQueueStatus do
  describe '#execute!' do
    subject { described_class.new(current_user, params) }
    let(:current_user) { create(:user, :with_site_admin_role) }
    let(:user) { create :user }

    let(:params) do
      {
        user: user
      }
    end

    context 'with vehicle ready' do
      let!(:ready_vehicle) { create :vehicle, user: user, approval_status: 'pending' }
      let!(:not_ready_vehicle) { create :vehicle, user: user }

      context 'when user has all documents' do
        let(:user) { create :user, approval_status: 'pending' }

        context 'with pending required documents for user' do
          let!(:document) { create :document, :required, user: user, approval_status: 'pending' }

          context 'when user is not in queue yet' do
            it 'shoud put user in queue' do
              subject.execute!
              expect(subject).to be_success
              expect(user.reload.ready_for_approval_since).to be_present
            end
          end

          context 'when user is in queue' do
            let(:user) { create :user, ready_for_approval_since: Time.current - 1.hour }

            it 'shoud not move him inside queue' do
              expect { subject.execute! }.not_to change { user.reload.ready_for_approval_since }
              expect(subject).to be_success
            end
          end

          context 'with pending required documents for ready vehicle' do
            let!(:document) { create :document, :required, user: user, vehicle: ready_vehicle, approval_status: 'pending' }

            context 'when user is not in queue yet' do
              it 'shoud put user in queue' do
                subject.execute!
                expect(subject).to be_success
                expect(user.reload.ready_for_approval_since).to be_present
              end
            end
          end

          context 'with pending required documents for not ready vehicle' do
            let!(:document) { create :document, :required, user: user, vehicle: not_ready_vehicle, approval_status: 'pending' }

            context 'when user is not in queue yet' do
              it 'shoud put user in queue' do
                subject.execute!
                expect(subject).to be_success
                expect(user.reload.ready_for_approval_since).to be_nil
              end
            end
          end
        end
      end

      context 'without pending required documents' do
        let!(:required_document_1) { create :document, :required, user: user, approval_status: 'approved' }
        let!(:required_document_2) { create :document, :required, user: user, approval_status: 'rejected' }
        let!(:pending_optional_document) { create :document, user: user, approval_status: 'pending' }

        it 'shoud keep user outside of queue' do
          subject.execute!
          expect(subject).to be_success
          expect(user.reload.ready_for_approval_since).to be_nil
        end
      end
    end

    context 'with no vehicle ready' do
      let!(:vehicle) { create :vehicle, user: user }

      context 'with pending required documents' do
        let!(:document) { create :document, :required, user: user, approval_status: 'pending' }

        it 'shoud keep user outside of queue' do
          subject.execute!
          expect(subject).to be_success
          expect(user.reload.ready_for_approval_since).to be_nil
        end
      end

      context 'without pending required documents' do
        let!(:required_document_1) { create :document, :required, user: user, approval_status: 'approved' }
        let!(:required_document_2) { create :document, :required, user: user, approval_status: 'rejected' }
        let!(:pending_optional_document) { create :document, user: user, approval_status: 'pending' }

        it 'shoud keep user outside of queue' do
          subject.execute!
          expect(subject).to be_success
          expect(user.reload.ready_for_approval_since).to be_nil
        end
      end
    end

    context 'no more pending documents' do
      let(:user) { create(:user, ready_for_approval_since: Time.current) }

      before do
        create(:document, :approved, user: user)
        create(:document, :rejected, user: user)
      end

      it 'removes users from queue' do
        subject.execute!
        expect(subject).to be_success
        expect(user.reload.ready_for_approval_since).to be_nil
      end
    end
  end
end
