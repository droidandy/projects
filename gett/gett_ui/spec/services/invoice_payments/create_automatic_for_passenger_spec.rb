require 'rails_helper'

RSpec.describe InvoicePayments::CreateAutomaticForPassenger, type: :service do
  let(:company) { create(:company, payment_types: [PaymentOptions::PaymentType::PASSENGER_PAYMENT_CARD_PERIODIC]) }
  let(:passenger) { create(:passenger, company: company) }
  let!(:payment_card) do
    create(:payment_card, passenger: passenger, company: company, default: true, token: 'card_token')
  end

  subject(:service) { described_class.new(passenger: passenger) }

  before do
    invoice_ids = create_list(:cc_invoice, 2, amount_cents: 1000, company: company, member: passenger).map(&:id)
    create_payment_service = double('Payments::Create')

    expect(Payments::Create).to receive(:new)
      .with(
        payment_method_token: 'card_token',
        order_id: "invoices_#{invoice_ids.join('_')}",
        statement_soft_descriptor: "OT invoice(s): #{invoice_ids.join(', ')}",
        payment_params: {
          invoice_pks: invoice_ids,
          description: "Invoices #{invoice_ids.join(', ')}",
          amount_cents: 2000
        }
      ).and_return(create_payment_service)

    expect(create_payment_service).to receive(:execute).and_return(create_payment_service)
    expect(create_payment_service).to receive(:success?).and_return(true)
  end

  it 'executes successfully' do
    expect(service.execute).to be_success
  end
end
