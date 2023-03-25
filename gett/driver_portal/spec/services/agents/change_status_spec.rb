require 'rails_helper'

RSpec.describe Agents::ChangeStatus do
  let(:status) { 'available' }
  subject { described_class.new(current_user, status: status) }

  context 'current user is not an agent' do
    let(:current_user) { create(:user, :with_driver_role) }

    it 'forbids action' do
      expect { subject.execute! }.to raise_error(Pundit::NotAuthorizedError)
    end
  end

  context 'current user is an agent' do
    let(:current_user) { create(:user, :with_onboarding_agent_role) }

    context 'agent has no current status' do
      it 'updates status' do
        expect { subject.execute! }.to change { current_user.agent_statuses.count }.by(1)
        expect(subject).to be_success
        expect(current_user.reload.agent_status.status).to eq(status)
      end
    end

    context 'agent has current status' do
      before do
        create(:agent_status, user: current_user, status: 'busy', current: true)
      end

      it 'updates status' do
        expect { subject.execute! }.to change { current_user.agent_statuses.count }.by(1)
        expect(subject).to be_success
        expect(current_user.reload.agent_status.status).to eq(status)
      end

      context 'new status equals current' do
        let(:status) { 'busy' }

        it 'takes no action' do
          expect { subject.execute! }.not_to change { current_user.agent_statuses.count }
          expect(subject).to be_success
          expect(current_user.reload.agent_status.status).to eq(status)
        end
      end
    end

    context 'agent has assigned reviews and new status is offline' do
      let(:status) { 'offline' }
      let!(:completed_review) { create(:review, completed: true, agent: current_user) }
      let!(:review_in_progress) { create(:review, agent: current_user) }

      it 'finishes reviews' do
        subject.execute!
        expect(subject).to be_success
        expect(completed_review.reload.training_end_at).to be_present
        expect(review_in_progress.reload.agent).to be_nil
      end
    end

    context 'agent has assigned reviews and new status is in_progress' do
      let(:status) { 'in_progress' }
      let!(:review) { create(:review, agent: current_user) }

      it 'starts reviews' do
        subject.execute!
        expect(subject).to be_success
        expect(review.reload.training_start_at).to be_present
      end
    end
  end
end
