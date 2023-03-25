require 'rails_helper'

RSpec.describe Bookers::Index, type: :service do
  it { is_expected.to be_authorized_by(Bookers::IndexPolicy) }

  describe '#execute' do
    service_context { { member: admin } }

    let(:admin) { create :admin }

    subject(:service) { Bookers::Index.new(query: {page: 1}) }

    it { is_expected.to use_policy_scope }

    describe 'execution result' do
      subject { service.execute.result }

      it { is_expected.to include :items, :pagination }
      its([:can]) { is_expected.to include :add_booker }
    end
  end
end
