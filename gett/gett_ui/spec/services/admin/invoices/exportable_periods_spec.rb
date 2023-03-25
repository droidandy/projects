require 'rails_helper'

RSpec.describe Admin::Invoices::ExportablePeriods, type: :service do
  let(:admin) { create :user, :admin }
  subject(:service) { Admin::Invoices::ExportablePeriods.new }

  it { is_expected.to be_authorized_by(Admin::Invoices::Policy) }

  describe '#execute' do
    service_context { { user: admin } }

    describe 'execution result' do
      before { service.execute }
      it { is_expected.to be_success }
    end
  end
end
