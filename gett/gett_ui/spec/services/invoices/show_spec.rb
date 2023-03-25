require 'rails_helper'

RSpec.describe Invoices::Show, type: :service do
  let(:company) { create(:company) }
  let(:admin)   { create(:admin, company: company) }
  let(:invoice) do
    create(:invoice,
      company: company,
      created_at: 1.week.ago,
      overdue_at: 1.week.from_now,
      billing_period_start: 1.day.ago,
      billing_period_end: 1.hour.ago,
      paid_at: 3.days.ago,
      amount_cents: 100,
      paid_amount_cents: 100
    )
  end
  let(:freeze_time) { '2018-10-24 13:00:00'.to_datetime }

  before { Timecop.freeze(freeze_time) }
  after  { Timecop.return }

  subject(:service) { described_class.new(invoice: invoice) }
  service_context { { company: company } }

  describe 'execution' do
    before { service.execute }

    it { is_expected.to be_success }
  end

  describe 'result' do
    subject { service.execute.result }

    its(:keys) do
      are_expected.to match_array(%w(
        id type billing_period_start billing_period_end created_at overdue_at
        status_label amount_cents paid_amount_cents status is_credit_note
        pdf_document_path payment_type display_id description payment_pending user_name
        under_review
      ))
    end

    its(['type'])                 { is_expected.to eq 'invoice' }
    its(['billing_period_start']) { is_expected.to eq 1.day.ago }
    its(['billing_period_end'])   { is_expected.to eq 1.hour.ago }
    its(['created_at'])           { is_expected.to eq 1.week.ago }
    its(['overdue_at'])           { is_expected.to eq 1.week.from_now }
    its(['amount_cents'])         { is_expected.to eq 100 }
    its(['status'])               { is_expected.to eq 'paid' }
    its(['status_label'])         { is_expected.to eq 'Paid' }
    its(['is_credit_note'])       { is_expected.to be false }
    its(['user_name'])            { is_expected.to be nil }
    its(['description'])          { is_expected.to eq '23/10/2018 - 24/10/2018' }

    context 'between days' do
      let(:freeze_time) { '2018-10-24 23:30:00'.to_datetime }

      its(['description']) { is_expected.to eq '24/10/2018 - 24/10/2018' }
    end

    context 'cc_invoice' do
      let(:member) { create(:member, first_name: 'Ivan', last_name: 'Ivanov') }
      let(:invoice) { create(:cc_invoice, member: member) }

      its(['user_name']) { is_expected.to eq 'Ivan Ivanov' }
    end

    context 'partially paid invoice' do
      let(:invoice) do
        create(:invoice,
          company: company,
          paid_amount_cents: 100,
          amount_cents: 200
        )
      end

      subject { service.execute.result }

      its(['status'])       { is_expected.to eq 'partially_paid' }
      its(['status_label']) { is_expected.to eq 'Partial Paid' }
    end
  end
end
