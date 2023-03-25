require 'rails_helper'

RSpec.describe Agents::AssignDriver do
  describe '#execute!' do
    subject { described_class.new(current_user, params) }
    let(:params) { { agent_id: agent.id, driver_id: driver.id } }
    let(:driver) { create(:user, :with_driver_role) }
    let(:agent) { create(:user, :with_onboarding_agent_role) }
    let(:current_user) { create(:user, :with_onboarding_agent_role) }
    let(:review) { create(:review, driver: driver) }

    it 'assigns driver to agent' do
      expect { subject.execute! }.to change { review.reload.agent }.from(nil).to(agent)
      expect(subject).to be_success
    end
  end
end
