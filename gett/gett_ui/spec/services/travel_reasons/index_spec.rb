require 'rails_helper'

RSpec.describe TravelReasons::Index, type: :service do
  let(:travel_reason) { create :travel_reason }
  let(:companyadmin)  { create :companyadmin }
  subject(:service)   { TravelReasons::Index.new }

  it { is_expected.to be_authorized_by(TravelReasons::IndexPolicy) }

  describe '#execute' do
    service_context { { member: companyadmin } }

    it { is_expected.to use_policy_scope.returning(TravelReason.dataset) }

    describe 'execution result' do
      before { service.execute }
      it { is_expected.to be_success }
    end
  end
end
