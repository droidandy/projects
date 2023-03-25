require 'rails_helper'

RSpec.describe Invoice, type: :model do
  describe 'delegations' do
    it { is_expected.to respond_to(:company_name) }
    it { is_expected.to respond_to(:member_full_name) }
  end

  describe 'associations' do
    it { is_expected.to have_many_to_one :company }
    it { is_expected.to have_many_to_one :member }
    it { is_expected.to have_many_to_one :paid_by }
    it { is_expected.to have_many_to_one :created_by }
    it { is_expected.to have_many_to_one :credited_invoice }

    it { is_expected.to have_one_to_many :credit_notes }
    it { is_expected.to have_one_to_many :credit_note_lines }

    it { is_expected.to have_many_to_many :bookings }
    it { is_expected.to have_many_to_many :payments }
  end

  describe '#validate' do
    let(:invoice) { build(:invoice, amount_cents: 100, paid_amount_cents: paid_amount_cents) }

    context 'paid amount is nil' do
      let(:paid_amount_cents) { nil }

      it { expect(invoice).not_to be_valid }
    end

    context 'paid amount is greater than total amount' do
      let(:paid_amount_cents) { 150 }

      it { expect(invoice).not_to be_valid }
    end

    context 'paid amount is equal to total amount' do
      let(:paid_amount_cents) { 100 }

      it { expect(invoice).to be_valid }
    end

    context 'paid amount is less than total amount' do
      let(:paid_amount_cents) { 50 }

      it { expect(invoice).to be_valid }
    end

    context 'paid amount is less than total amount' do
      let(:paid_amount_cents) { -50 }

      it { expect(invoice).not_to be_valid }
    end

    context 'cc_invoice validations' do
      let(:invoice) { build(:cc_invoice) }

      it { expect(invoice).to be_valid }

      context 'member is nil' do
        let(:invoice) { build(:cc_invoice, member: nil) }

        it { expect(invoice).not_to be_valid }
      end
    end
  end

  describe 'dataset_module' do
    describe '#partially_paid' do
      let(:company) { create(:company) }
      let!(:partially_paid_invoice) { create(:invoice, company: company, amount_cents: 100, paid_amount_cents: 50) }

      before do
        create(:credit_note, company: company, amount_cents: 100, paid_amount_cents: nil)
        create(:invoice, company: company, amount_cents: 100, paid_amount_cents: 0)
        create(:invoice, company: company, amount_cents: 100, paid_amount_cents: 100)
      end

      subject(:partially_paid_invoices) { Invoice.partially_paid.all }

      it { is_expected.to eq([partially_paid_invoice]) }
    end

    describe 'subsets' do
      let!(:invoice) { create(:invoice) }

      describe 'processing' do
        subject { Invoice.processing.all }

        context 'invoice without pending payments' do
          it { is_expected.to_not include(invoice) }
        end

        context 'invoice with pending payment' do
          before { create(:payment, :pending, booking_id: nil, invoice_pks: [invoice.id]) }
          it { is_expected.to include(invoice) }
        end

        context 'invoice with pending direct debit' do
          before { create(:direct_debit_payment, invoice: invoice) }
          it { is_expected.to include(invoice) }
        end
      end

      describe 'outstanding_without_processing' do
        subject { Invoice.outstanding_without_processing.all }

        context 'overdue invoice' do
          let!(:invoice) { create(:invoice, :overdue) }
          it { is_expected.to_not include(invoice) }
        end

        context 'invoice with pending payment' do
          before { create(:payment, :pending, booking_id: nil, invoice_pks: [invoice.id]) }
          it { is_expected.to_not include(invoice) }
        end

        context 'invoice with pending direct debit' do
          before { create(:direct_debit_payment, invoice: invoice) }
          it { is_expected.to_not include(invoice) }
        end

        context 'outstanding invoice' do
          it { is_expected.to include(invoice) }
        end
      end

      describe 'overdue_without_processing' do
        subject { Invoice.overdue_without_processing.all }

        context 'invoice with pending payment' do
          before { create(:payment, :pending, booking_id: nil, invoice_pks: [invoice.id]) }
          it { is_expected.to_not include(invoice) }
        end

        context 'overdue invoice' do
          let!(:invoice) { create(:invoice, :overdue) }
          it { is_expected.to include(invoice) }
        end
      end

      describe 'credit note scopes' do
        let!(:invoice) { create(:invoice) }
        let!(:issued_credit_note) { create(:credit_note) }
        let!(:applied_credit_note) { create(:credit_note, credited_invoice: create(:invoice)) }
        let!(:manually_applied_credit_note) { create(:credit_note, applied_manually: true) }

        describe 'issued' do
          subject { Invoice.issued.all }

          it { is_expected.to_not include(invoice) }
          it { is_expected.to include(issued_credit_note) }
          it { is_expected.to_not include(applied_credit_note) }
          it { is_expected.to_not include(manually_applied_credit_note) }
        end

        describe 'applied' do
          subject { Invoice.applied.all }

          it { is_expected.to_not include(invoice) }
          it { is_expected.to_not include(issued_credit_note) }
          it { is_expected.to include(applied_credit_note) }
          it { is_expected.to include(manually_applied_credit_note) }
        end
      end
    end
  end

  describe '#overdue?' do
    context 'when it is a credit note' do
      subject { create(:credit_note) }

      it { is_expected.to_not be_overdue }
    end

    context 'when it is outstanding' do
      subject { create(:invoice) }

      it { is_expected.to_not be_overdue }

      context 'when it is long overdue' do
        subject { create(:invoice, overdue_at: 1.month.ago.end_of_month) }

        it { is_expected.to be_overdue }
      end
    end
  end

  describe '#paid? #outstanding? #overdue?' do
    context 'when paid_at is present' do
      subject { create(:invoice, amount_cents: 100, paid_amount_cents: 100, paid_at: 1.month.ago.end_of_month) }

      it { is_expected.to be_paid }
      it { is_expected.to_not be_outstanding }
    end

    context 'when paid amount greater than 0 but less than amount' do
      subject { create(:invoice, amount_cents: 100, paid_amount_cents: 50) }

      it { is_expected.to_not be_paid }
      it { is_expected.to_not be_outstanding }
    end

    context 'when paid amount is 0' do
      subject { create(:invoice, amount_cents: 100, paid_amount_cents: 0) }

      it { is_expected.to_not be_paid }
      it { is_expected.to be_outstanding }

      context 'and when invoice is overdue' do
        subject { create(:invoice, paid_at: nil, overdue_at: 1.day.ago) }

        it { is_expected.to_not be_outstanding }
        it { is_expected.to be_overdue }
      end
    end
  end

  describe '#partially_paid?' do
    context 'paid_at nil' do
      subject { create(:invoice, paid_at: nil) }

      it { is_expected.to_not be_partially_paid }
    end

    context 'partial_paid_amount_cents 0' do
      subject { create(:invoice, paid_amount_cents: 0) }

      it { is_expected.to_not be_partially_paid }
    end

    context 'partial_paid_amount_cents 0' do
      subject { create(:invoice, amount_cents: 100, paid_amount_cents: 50) }

      it { is_expected.to be_partially_paid }
    end
  end

  describe '#status' do
    subject { invoice.status }

    context 'when it is a credit note' do
      let(:invoice) { create(:credit_note) }

      it { is_expected.to be :issued }

      context 'when it has a credited invoice associated with it' do
        let(:invoice) { create(:credit_note, credited_invoice: create(:invoice)) }

        it { is_expected.to be :applied }
      end
    end

    context 'when it is paid' do
      let(:invoice) { create(:invoice, paid_at: 1.week.ago) }

      it { is_expected.to be :paid }
    end

    context 'when it has not being paid yet' do
      let(:invoice) { create(:invoice, paid_at: nil) }

      it { is_expected.to be :outstanding }
    end

    context 'when it is overdue' do
      let(:invoice) { create(:invoice, overdue_at: 1.week.ago) }

      it { is_expected.to be :overdue }
    end

    context 'when it is partially paid' do
      let(:invoice) { create(:invoice, amount_cents: 100, paid_amount_cents: 50) }

      it { is_expected.to be :partially_paid }
    end

    context 'when it is overdue and has a pending payment' do
      let(:invoice) { create(:invoice, overdue_at: Time.current) }
      before { create(:payment, :pending, invoice_pks: [invoice.id]) }

      it { is_expected.to be :processing }
    end
  end

  describe '#paid_by_business_credit?' do
    subject { create(:invoice, business_credit_cents: 100) }

    it { is_expected.to be_paid_by_business_credit }
  end

  describe '#payment_pending?' do
    let(:invoice) { create(:invoice) }

    subject { invoice }

    context 'with outstanding payments' do
      let!(:payment) { create(:payment, :pending, invoice_pks: [invoice.id]) }

      it { is_expected.to be_payment_pending }
      its(:status) { is_expected.to eq(Invoice::Status::PROCESSING) }
    end

    context 'without outstanding payments' do
      it { is_expected.to_not be_payment_pending }
    end

    context 'with pending direct debit payment' do
      before { create(:direct_debit_payment, invoice: invoice) }

      it { is_expected.to be_payment_pending }
    end
  end

  describe '#credit_note?' do
    subject { build(:credit_note) }

    it { is_expected.to be_credit_note }
  end

  describe '#invoice?' do
    subject { build(:invoice) }

    it { is_expected.to be_invoice }
  end

  describe '#cc_invoice?' do
    subject { build(:cc_invoice) }

    it { is_expected.to be_cc_invoice }
  end

  describe '#last_payment' do
    subject(:invoice) { create(:invoice) }
    let!(:payment) { create(:payment, booking_id: nil, invoice_pks: [invoice.id]) }
    let!(:direct_debit_payment) { create(:direct_debit_payment, invoice: invoice) }

    it 'returns last payment' do
      expect(invoice.last_payment).to be_a(DirectDebitPayment)
      payment.update(created_at: Time.current)
      expect(invoice.reload.last_payment).to be_a(Payment)
    end
  end

  describe '#mark_as_paid!' do
    let(:invoice) { create(:invoice, amount_cents: 100) }

    context 'when amount and paid_by is omitted' do
      it 'becomes paid' do
        invoice.mark_as_paid!
        expect(invoice).to be_paid
      end
    end

    context 'when amount and paid_by is specified' do
      context 'when amount is less than total' do
        it 'becomes partially paid' do
          invoice.mark_as_paid!(50, create(:admin))
          expect(invoice).to be_partially_paid
        end
      end

      context 'when amount is equal to total' do
        it 'becomes paid' do
          invoice.mark_as_paid!(100, create(:admin))
          expect(invoice).to be_paid
        end
      end
    end
  end
end
