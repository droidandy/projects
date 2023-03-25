require 'rails_helper'

RSpec.describe Invoices::CreateForCompany, type: :service do
  let(:payment_options) { create(:payment_options, invoicing_schedule: 'monthly') }
  let(:company) { payment_options.company }
  let(:booker) { create(:member, company: company) }

  let(:billing_period) do
    Invoices::Create::BILLING_PERIODS['monthly'].call
  end

  subject(:service) { described_class.new(company: company, billing_period: billing_period) }

  context 'without bookings in billing period' do
    it 'does not create an invoice' do
      expect{ service.execute }.not_to change(Invoice, :count)
    end
  end

  context 'with bookings in billing period' do
    let!(:booking) do
      create(:booking, :completed,
        booker: booker,
        scheduled_at: 1.month.ago,
        payment_method: :account,
        total_cost: 123,
        billed: billed
      )
    end

    let(:billed) { false }

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

    context 'with pending credit notes' do
      let!(:credit_note) { create(:invoice, company: company, type: 'credit_note', amount_cents: 100) }

      it 'does not deduce credit note amount from the invoice' do
        expect(service.execute).to be_success
        invoice = service.result
        expect(invoice.values).to include(amount_cents: 123)
        expect(credit_note.reload.credited_invoice).to be_nil
      end
    end

    context 'booking is billed' do
      let(:billed) { true }

      before { expect(Rails.env).to receive(:production?).and_return(prod_env?) }

      context 'in production environment' do
        let(:prod_env?) { true }

        it 'does not create an invoice' do
          expect{ service.execute }.not_to change(Invoice, :count)
        end
      end

      context 'in not production environment' do
        let(:prod_env?) { false }

        it 'creates an invoice' do
          expect{ service.execute }.to change(Invoice, :count).by(1)
        end
      end
    end
  end

  context 'with booking outside billing period' do
    let!(:booking) do
      create(:booking, :completed,
        booker: booker,
        scheduled_at: 2.months.ago,
        total_cost: 123,
        payment_method: :account
      )
    end

    it 'does not create an invoice' do
      expect{ service.execute }.not_to change{ Invoice.count }
    end
  end

  context 'with company payment card' do
    let(:payment_options) do
      create(:payment_options, invoicing_schedule: 'monthly', payment_types: ['company_payment_card'])
    end
    let!(:payment_card) { create(:payment_card, :company, company: company) }
    let!(:booking) do
      create(:booking, :completed,
        booker: booker,
        scheduled_at: 1.month.ago,
        payment_method: :company_payment_card,
        total_cost: 123
      )
    end

    before do
      invoice_payment_service = double('InvoicePayments::CreateAutomatic')
      expect(InvoicePayments::CreateAutomatic).to receive(:new).and_return(invoice_payment_service)
      expect(invoice_payment_service).to receive(:execute).and_return(true)
    end

    it 'creates an invoice and attempts a payment' do
      expect(service.execute).to be_success
      invoice = service.result
      expect(invoice.amount_cents).to eq(123)
    end
  end

  context 'company has business credit available' do
    let(:business_credit) { 10000 }
    let(:payment_options) do
      create(:payment_options,
        invoicing_schedule: 'monthly',
        business_credit: business_credit / 100,
        business_credit_expended: false
      )
    end
    let!(:booking) do
      create(:booking, :completed,
        booker: booker,
        scheduled_at: 1.month.ago,
        payment_method: :account,
        total_cost: total_cost
      )
    end

    context 'business credit amount is bigger than invoice total cost' do
      let(:total_cost) { business_credit - 1000 }

      it 'creates paid invoice and sets payment_options#business_credit_expended to true' do
        expect(service.execute).to be_success
        invoice = service.result
        expect(invoice.values).to include(amount_cents: 0, business_credit_cents: total_cost)
        expect(invoice).to be_paid
        expect(invoice).to be_paid_by_business_credit
        expect(invoice.booking_pks).to eq([booking.id])
        expect(payment_options.business_credit_expended?).to be true
      end
    end

    context 'business credit amount equals invoice total cost' do
      let(:total_cost) { business_credit }

      it 'creates paid invoice and sets payment_options#business_credit_expended to true' do
        expect(service.execute).to be_success
        invoice = service.result
        expect(invoice.values).to include(amount_cents: 0, business_credit_cents: total_cost)
        expect(invoice).to be_paid
        expect(invoice).to be_paid_by_business_credit
        expect(invoice.booking_pks).to eq([booking.id])
        expect(payment_options.business_credit_expended?).to be true
      end
    end

    context 'business credit amount equals invoice total cost' do
      let(:total_cost) { business_credit + 1000 }

      it 'creates paid invoice and sets payment_options#business_credit_expended to true' do
        expect(service.execute).to be_success
        invoice = service.result
        expect(invoice.values).to include(amount_cents: 1000, business_credit_cents: business_credit)
        expect(invoice).not_to be_paid
        expect(invoice).not_to be_paid_by_business_credit
        expect(invoice.booking_pks).to eq([booking.id])
        expect(payment_options.business_credit_expended?).to be true
      end
    end
  end
end
