require 'rails_helper'

RSpec.describe TravelRules::UpdatePriorities, type: :service do
  it { is_expected.to be_authorized_by(TravelRules::UpdatePrioritiesPolicy) }

  describe '#execute' do
    let(:company) { create :company }
    let(:rule1)   { create :travel_rule, company: company, priority: 1 }
    let(:rule2)   { create :travel_rule, company: company, priority: 2 }
    let(:rule3)   { create :travel_rule, company: company, priority: 3 }

    service_context { { company: company } }

    subject(:service) { TravelRules::UpdatePriorities.new(ordered_ids: [rule2.id, rule3.id, rule1.id]) }

    describe 'execution result' do
      before { service.execute }

      it { is_expected.to be_success }
    end

    it { expect{ service.execute }.to change{ rule1.reload.priority }.from(1).to(3) }
    it { expect{ service.execute }.to change{ rule2.reload.priority }.from(2).to(1) }
    it { expect{ service.execute }.to change{ rule3.reload.priority }.from(3).to(2) }
  end
end
