require 'rails_helper'

describe Sessions::Current, type: :service do
  let(:member)  { create(:companyadmin, company: company) }
  let(:company) { create(:company, payment_types: payment_types) }
  let(:payment_types) { ['account'] }

  subject(:service) { described_class.new(member: member, user: member) }

  describe 'result' do
    before { service.execute }

    subject { service.result }

    its(:keys) do
      is_expected.to include(
        :email,
        :name,
        :member_id,
        :reincarnated,
        :guide_passed,
        :onboarding,
        :import_channel,
        :bookings_channel,
        :internal_messages_channel,
        :export_invoices_bunch_channel,
        :export_receipts_bunch_channel,
        :external_messages_channel,
        :personal_messages_channel,
        :warning,
        :is_affiliate,
        :is_bbc,
        :company_id,
        :bookings_validation_enabled,
        :active_bookings_info_channel,
        :layout,
        :can
      )
    end
  end

  describe 'finance management permissions' do
    before { service.execute }

    subject { service.result[:can][:manage_finance] }

    context 'when company only has passenger_payment_card as payment method' do
      let(:payment_types) { ['passenger_payment_card'] }

      it 'has no access to finance' do
        is_expected.to be false
      end
    end

    context 'when company has other payment methods' do
      let(:payment_types) { ['account', 'passenger_payment_card'] }

      it 'has access to finance' do
        is_expected.to be true
      end
    end
  end

  describe 'warning' do
    let(:company) { create(:company, payment_types: ['company_payment_card']) }
    let(:member)  { create(:finance, company: company) }

    subject { service.execute.result[:warning] }

    it { is_expected.to be_nil }

    context 'invoice with failed payment' do
      let(:invoice) { create(:invoice, company: company) }

      before do
        create(:payment, booking: nil, invoice_pks: [invoice.id], status: 'failed')
      end

      it { is_expected.to eq('Your last payment failed, please update you card info.') }

      context 'member is not executive or finance' do
        let(:member) { create(:member) }

        it { is_expected.to be_nil }
      end

      context 'company payment type is not payment_card' do
        let(:company) { create(:company, payment_types: ['account']) }

        it { is_expected.to be_nil }
      end

      context 'a pending payment follows a failed payment' do
        before do
          create(:payment, booking: nil, invoice_pks: [invoice.id], status: 'pending')
        end

        it { is_expected.to be_nil }
      end
    end
  end

  describe 'procurement statistics permissions' do
    let(:company) { create(:company, linked_company_pks: linked_company_pks) }
    let(:member)  { create(:companyadmin, company: company) }

    before { service.execute }

    subject { service.result[:can][:see_procurement_statistics] }

    context 'company has linked companies' do
      let(:linked_company) { create(:company) }
      let(:linked_company_pks) { [linked_company.id] }

      it { is_expected.to be(true) }
    end

    context 'company has no linked companies' do
      let(:linked_company_pks) { [] }

      it { is_expected.to be(false) }
    end
  end
end
