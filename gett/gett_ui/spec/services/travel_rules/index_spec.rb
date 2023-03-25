require 'rails_helper'

RSpec.describe TravelRules::Index, type: :service do
  let(:company) { create :company }
  subject(:service) { TravelRules::Index.new }

  it { is_expected.to be_authorized_by(TravelRules::IndexPolicy) }

  describe '#execute' do
    service_context { { company: company } }

    describe 'execution result' do
      before { service.execute }
      it { is_expected.to be_success }
    end
  end
end
