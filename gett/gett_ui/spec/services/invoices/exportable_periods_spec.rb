require 'rails_helper'

RSpec.describe Invoices::ExportablePeriods, type: :service do
  let(:member)  { create(:finance) }
  let(:company) { create(:company) }
  subject(:service) { Invoices::ExportablePeriods.new }

  service_context { { company: company } }

  describe '#execute' do
    service_context { { user: member } }

    describe 'execution result' do
      before { service.execute }
      it { is_expected.to be_success }
    end
  end
end
