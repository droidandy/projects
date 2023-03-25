require 'rails_helper'

describe GoCardless::PaymentEventProcessor, type: :service do
  let!(:company) { create(:company) }
  let!(:companyadmin) { create(:companyadmin, company: company) }
  let!(:invoice) { create(:invoice, company: company) }
  let!(:mandate) { create(:direct_debit_mandate, company: company) }
  let!(:payment) do
    create(:direct_debit_payment, invoice: invoice, direct_debit_mandate: mandate)
  end

  subject(:service) { GoCardless::PaymentEventProcessor.new(payment: payment, event: event) }

  describe 'payment completed' do
    let(:event) { { action: 'paid_out' } }

    it 'updates payment' do
      expect{ service.execute }.to change{ payment.reload.status }
        .to(DirectDebitPayment::SUCCESSFUL)
    end

    it 'marks invoice paid' do
      expect{ service.execute }.to change{ invoice.reload.paid? }.to(true)
    end

    it 'send an email notification' do
      service.execute
      mail = ActionMailer::Base.deliveries.last
      expect(mail.body).to include('has been received')
    end
  end

  describe 'payment failed' do
    let(:event) { { action: 'failed' } }

    it 'updates payment' do
      expect{ service.execute }.to change{ payment.reload.status }
        .to(DirectDebitPayment::FAILED)
    end
  end
end
