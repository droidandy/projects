require 'rails_helper'

RSpec.describe InvoicePayments::Retry, type: :service do
  let(:company)  { create :company }
  let(:admin)    { create :admin, company: company }

  service_context { { company: company, user: admin } }

  subject(:service) { described_class.new }

  it { is_expected.to be_authorized_by(InvoicePayments::CreateManualPolicy) }

  describe '#execute' do
    before do
      invoice_payments_service = double('InvoicePayments::CreateAutomatic')
      expect(InvoicePayments::CreateAutomatic).to receive(:new).with(company: company)
        .and_return(invoice_payments_service)
      expect(invoice_payments_service).to receive(:execute).and_return(invoice_payments_service)
      expect(invoice_payments_service).to receive(:success?).and_return(true)
    end

    it 'executes successfully if invoice payment services does' do
      expect(service.execute).to be_success
    end
  end
end
