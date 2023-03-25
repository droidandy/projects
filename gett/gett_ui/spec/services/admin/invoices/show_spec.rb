require 'rails_helper'

RSpec.describe Admin::Invoices::Show, type: :service do
  let(:company) { create(:company, name: 'Disney') }
  let(:user)    { create(:user, first_name: 'John', last_name: 'Lennon') }
  let(:admin)   { create(:user, :admin, first_name: 'Admin') }
  let(:invoice) do
    create(:invoice,
      company: company,
      created_at: 1.week.ago,
      paid_at: 1.hour.ago,
      overdue_at: 1.week.from_now,
      created_by_id: admin.id,
      amount_cents: 200,
      paid_amount_cents: 200
    )
  end

  before { Timecop.freeze(Time.current.change(nsec: 0)) }
  after  { Timecop.return }

  subject(:service) { described_class.new(invoice: invoice) }

  describe 'execution' do
    before { service.execute }

    it { is_expected.to be_success }
  end

  describe 'result' do
    subject { service.execute.result }

    its(:keys) do
      are_expected.to match_array(%w(
        id type created_at overdue_at amount_cents company_id status status_label
        company_name overdue_by paid_at is_credit_note pdf_document_path user_name
        payment_details transaction_id payment_type paid_amount_cents
        company_payment_method company_payment_types under_review is_reviewable
      ))
    end

    its(['type'])                  { is_expected.to eq 'invoice' }
    its(['created_at'])            { is_expected.to eq 1.week.ago }
    its(['overdue_at'])            { is_expected.to eq 1.week.from_now }
    its(['amount_cents'])          { is_expected.to eq 200 }
    its(['paid_amount_cents'])     { is_expected.to eq 200 }
    its(['company_id'])            { is_expected.to eq company.id }
    its(['status'])                { is_expected.to eq 'paid' }
    its(['status_label'])          { is_expected.to eq 'Paid' }
    its(['company_name'])          { is_expected.to eq 'Disney' }
    its(['created_by_id'])         { is_expected.to be nil }
    its(['paid_at'])               { is_expected.to eq 1.hour.ago }
    its(['created_by_name'])       { is_expected.to be nil }
    its(['overdue_by'])            { is_expected.to be nil }
    its(['is_credit_note'])        { is_expected.to be false }
    its(['company_payment_method']){ is_expected.to be nil }
    its(['company_payment_types']) { is_expected.to eq ['account'] }
    its(['user_name'])             { is_expected.to be nil }
    its(['under_review'])          { is_expected.to be false }
    its(['is_reviewable'])         { is_expected.to be false }

    context 'when credit note' do
      let(:invoice) { create(:credit_note, created_by_id: admin.id) }

      its(['created_by_id'])   { is_expected.to eq admin.id }
      its(['created_by_name']) { is_expected.to eq 'Admin' }
    end

    context 'when cc_invoice' do
      let(:member) { create(:member, first_name: 'Ivan', last_name: 'Ivanov') }
      let(:invoice) { create(:cc_invoice, member: member) }

      its(['user_name']) { is_expected.to eq 'Ivan Ivanov' }
    end

    context 'when paid by admin' do
      let(:invoice) { create(:invoice, paid_at: Time.current, paid_by: user) }

      its(['status_label']) { is_expected.to eq 'Paid by John Lennon' }
    end

    context 'when paid by Business Credit' do
      let(:invoice) { create(:invoice, :paid_by_business_credit, paid_at: Time.current, paid_by: nil) }

      its(['status_label']) { is_expected.to eq 'Paid by Business Credit' }
    end

    context 'when overdue' do
      let(:invoice) { create(:invoice, paid_at: nil, overdue_at: 14.days.ago) }

      its(['overdue_by']) { is_expected.to eq '15 days' }
    end

    context 'with payment card' do
      before { create(:payment_card, company: company) }

      its(['company_payment_method']) { is_expected.to eq :payment_card }
    end

    context 'with direct debit set up' do
      before { create(:direct_debit_mandate, :active, company: company) }

      its(['company_payment_method']) { is_expected.to eq :direct_debit }
    end

    context 'with card payment' do
      before do
        create(
          :payment,
          booking: nil,
          invoice_pks: [invoice.id],
          payments_os_id: 'payments-os-id',
          zooz_request_id: 'zooz-request-id',
          error_description: 'error-description'
        )
      end

      its(['payment_details']) do
        is_expected.to eq(
          'payments_os_id' => 'payments-os-id',
          'zooz_request_id' => 'zooz-request-id',
          'error_description' => 'error-description'
        )
      end
    end

    context 'with direct debit payment' do
      before do
        create(
          :direct_debit_payment,
          invoice: invoice,
          go_cardless_payment_id: 'go-cardless-payment-id'
        )
      end

      its(['payment_details']) do
        is_expected.to eq(
          'go_cardless_payment_id' => 'go-cardless-payment-id'
        )
      end
    end
  end
end
