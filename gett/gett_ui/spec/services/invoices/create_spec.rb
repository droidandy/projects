require 'rails_helper'

RSpec.describe Invoices::Create, type: :service do
  let(:payment_options) { create(:payment_options, invoicing_schedule: 'monthly', payment_types: payment_types) }
  let(:company) { payment_options.company }
  let(:booker) { create(:member, company: company) }
  let(:payment_types) { [ payment_type ] }
  let!(:booking) do
    create(:booking, :completed,
      booker: booker,
      passenger: booker,
      scheduled_at: 1.month.ago,
      payment_method: payment_type,
      total_cost: 123
    )
  end

  let(:billing_period) do
    Invoices::Create::BILLING_PERIODS['monthly'].call
  end

  subject(:service) { described_class.new(company: company, custom_billing_period: billing_period) }

  context 'with bookings in billing period' do
    let(:payment_type) { PaymentOptions::PaymentType::ACCOUNT }

    it 'creates an invoice with the booking' do
      expect(service.execute).to be_success
      invoice = service.result
      expect(invoice.values).to include(amount_cents: 123)
      expect(invoice).to_not be_paid
      expect(invoice.booking_pks).to eq([booking.id])
      expect(invoice.overdue_at).to eq(Time.current.beginning_of_day + payment_options.payment_terms.days)
    end
  end

  context 'without company periodic payment type' do
    let(:payment_type) { PaymentOptions::PaymentType::ACCOUNT }

    it 'call regular invoice creator' do
      expect(Invoices::CreateForCompany)
        .to receive(:new)
        .with(company: company, billing_period: billing_period)
        .and_call_original
      expect(Invoices::CreateForPassenger).not_to receive(:new)

      service.execute
    end
  end

  context 'with company periodic payment type' do
    let(:payment_type) { PaymentOptions::PaymentType::PASSENGER_PAYMENT_CARD_PERIODIC }

    before do
      # multiple orders for the same passenger are created to check that `CreateForPassenger`
      # service is called only once per passenger
      create(:booking, :completed,
        booker: booker,
        passenger: booker,
        scheduled_at: 1.month.ago,
        payment_method: payment_type,
        total_cost: 123
      )

      stub_request(:post, "https://api.paymentsos.com/payments").to_timeout
      allow_any_instance_of(InvoicePayments::CreateAutomatic).to receive(:execute!)
      expect(InvoicesMailer).to receive(:passenger_invoice_created_notification).and_return(double(deliver_later: true))
    end

    it 'call cc_invoice creator' do
      expect(Invoices::CreateForCompany).not_to receive(:new)
      expect(Invoices::CreateForPassenger)
        .to receive(:new)
        .with(passenger: booker, billing_period: billing_period)
        .once
        .and_call_original

      service.execute
    end
  end
end
