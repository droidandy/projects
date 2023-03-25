require 'rails_helper'

describe DirectDebitPayments::Create, type: :service do
  let(:invoice) { create(:invoice) }

  subject(:serivce) { DirectDebitPayments::Create.new(invoice: invoice) }

  describe '#execute' do
    context 'invoice is paid' do
      let(:invoice) { create(:invoice, :paid) }
      before { subject.execute }

      it { is_expected.not_to be_success }
    end

    context 'invoice has a pending payment' do
      before do
        create(:payment, :pending, invoice_pks: [invoice.id], booking_id: nil)
        subject.execute
      end

      it { is_expected.not_to be_success }
    end

    context 'direct debit is not set up' do
      before { subject.execute }
      it { is_expected.not_to be_success }
    end

    context 'direct debit is set up' do
      let!(:mandate) { create(:direct_debit_mandate, :active, company: invoice.company) }

      before do
        client = double('GoCardlessPro::Client')
        expect(GoCardlessClientBuilder).to receive(:build).and_return(client)
        expect(client).to receive(:payments).and_return(client)
        expect(client).to receive(:create).and_return(client)
        expect(client).to receive(:id).and_return('payment_id')
        subject.execute
      end

      it { is_expected.to be_success }

      it 'creates a direct debit payment' do
        payment = subject.result
        expect(payment.invoice).to eq(invoice)
        expect(payment.status).to eq(DirectDebitPayment::PENDING)
        expect(payment.direct_debit_mandate).to eq(mandate)
        expect(payment.amount_cents).to eq(invoice.amount_cents)
        expect(payment.go_cardless_payment_id).to eq('payment_id')
      end
    end
  end
end
