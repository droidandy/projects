require 'rails_helper'

RSpec.describe Admin::PredefinedAddresses::Index, type: :service do
  describe '#execute' do
    subject(:service) { Admin::PredefinedAddresses::Index.new(query: {page: 1}) }

    describe 'execution result' do
      subject { service.execute.result }

      it { is_expected.to include :items, :pagination }
    end
  end
end
