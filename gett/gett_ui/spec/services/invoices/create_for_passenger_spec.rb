require 'rails_helper'

RSpec.describe Invoices::CreateForPassenger, type: :service do
  let(:payment_options) { create(:payment_options, invoicing_schedule: 'monthly') }
  let(:company) { payment_options.company }
  let(:booker) { create(:member, company: company) }

  let(:billing_period) do
    Invoices::Create::BILLING_PERIODS['monthly'].call
  end

  subject(:service) { described_class.new(passenger: booker, billing_period: billing_period) }

  context 'without bookings in billing period' do
    it 'does not create an invoice' do
      expect{ service.execute }.not_to change{ Invoice.count }
    end
  end

  before do
    allow_any_instance_of(InvoicePayments::CreateAutomatic).to receive(:execute!)
  end

  context 'with bookings' do
    let!(:booking) do
      create(:booking, :completed,
        booker: booker,
        passenger: booker,
        scheduled_at: scheduled_at,
        payment_method: PaymentOptions::PaymentType::PASSENGER_PAYMENT_CARD_PERIODIC,
        total_cost: 123
      )
    end

    context 'in billing period' do
      let(:scheduled_at) { 1.month.ago }

      before do
        stub_request(:post, "https://api.paymentsos.com/payments").to_timeout

        expect(InvoicesMailer).to receive(:passenger_invoice_created_notification)
          .and_return(double(deliver_later: true))
      end

      it 'creates an invoice with the booking' do
        expect(service.execute).to be_success
        invoice = service.result
        expect(invoice.values).to include(amount_cents: 123)
        expect(invoice).to_not be_paid
        expect(invoice.booking_pks).to eq([booking.id])
      end

      it 'updates booking "billed" flag' do
        expect{ service.execute }.to change{ booking.reload.billed? }.from(false).to(true)
      end
    end

    context 'outside billing period' do
      let(:scheduled_at) { 2.months.ago }

      it 'does not create an invoice' do
        expect{ service.execute }.not_to change(Invoice, :count)
      end
    end
  end

  context 'when booking is billed' do
    let!(:booking) do
      create(:booking, :completed,
        booker: booker,
        passenger: booker,
        scheduled_at: 1.month.ago,
        payment_method: PaymentOptions::PaymentType::PASSENGER_PAYMENT_CARD_PERIODIC,
        total_cost: 123,
        billed: true
      )
    end

    before { expect(Rails.env).to receive(:production?).and_return(prod_env?) }

    context 'in production environment' do
      let(:prod_env?) { true }

      it 'does not create an invoice' do
        expect{ service.execute }.not_to change(Invoice, :count)
      end
    end

    context 'in not production environment' do
      let(:prod_env?) { false }

      before do
        stub_request(:post, "https://api.paymentsos.com/payments").to_timeout

        expect(InvoicesMailer).to receive(:passenger_invoice_created_notification)
          .and_return(double(deliver_later: true))
      end

      it 'creates an invoice' do
        expect{ service.execute }.to change(Invoice, :count).by(1)
      end
    end
  end
end
