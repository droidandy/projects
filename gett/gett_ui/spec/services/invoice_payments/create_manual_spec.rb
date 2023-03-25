require 'rails_helper'

RSpec.describe InvoicePayments::CreateManual, type: :service do
  let(:company)  { create :company }
  let(:admin)    { create :admin, company: company }
  let(:invoices) { create_list :invoice, 2, amount_cents: 1000, company: company }

  service_context { { company: company, user: admin } }

  subject(:service) do
    described_class.new(invoice_ids: invoices.map(&:id), card_token: 'card_token')
  end

  it { is_expected.to be_authorized_by(InvoicePayments::CreateManualPolicy) }

  describe '#execute' do
    context 'successful payment' do
      before do
        stub_create_payment_service(true)
      end

      it 'executes successfully' do
        expect(service.execute).to be_success
      end
    end

    context 'payment creation failed' do
      before do
        stub_create_payment_service(false)
      end

      it 'executes unsuccessfully' do
        expect(service.execute).to_not be_success
        expect(service.errors).to eq 'Cannot process the payment'
      end
    end

    context 'invoices are already paid' do
      let(:invoices) { create_list :invoice, 2, paid_at: Time.current, company: company }

      it 'executes unsuccessfully' do
        expect(service.execute).to_not be_success
        expect(service.errors).to eq 'Cannot pay for selected invoices'
      end
    end
  end

  def stub_create_payment_service(success)
    invoice_ids = invoices.map(&:id)
    create_payment_service = double('Payments::Create')
    expect(Payments::Create).to receive(:new).with(
      payment_method_token: 'card_token',
      order_id: "invoices_#{invoice_ids.join('_')}",
      statement_soft_descriptor: "OT invoice(s): #{invoice_ids.join(', ')}",
      payment_params: {
        invoice_pks: invoices.map(&:id),
        description: "Invoices #{invoice_ids.join(', ')}",
        amount_cents: 2000
      }
    ).and_return(create_payment_service)
    expect(create_payment_service).to receive(:execute).and_return(create_payment_service)
    expect(create_payment_service).to receive(:success?).and_return(success)
  end
end
