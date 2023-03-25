require 'rails_helper'

RSpec.describe Admin::Statistics::Company, type: :service do
  let(:admin) { create(:user) }
  let(:company) { create(:company) }

  subject(:service) { described_class.new(company: company) }

  service_context { { admin: admin } }

  describe '#execute' do
    context 'execution result' do
      before { service.execute }

      it { is_expected.to be_success }

      its(:result) do
        is_expected.to include(
          :count_by_status_monthly,
          :count_by_status_daily,
          :count_by_vehicle_name_monthly,
          :count_by_vehicle_name_daily,
          :spend_monthly,
          :spend_daily,
          :count_by_payment_type_monthly,
          :count_by_payment_type_daily,
          :completed_by_order_type,
          :outstanding_balance
        )
      end
    end
  end

  describe '#payment_methods' do
    let(:payment_methods) { %w(personal_payment_card business_payment_card cash account company_payment_card) }

    subject { service.send(:payment_methods) }

    it { is_expected.to match_array payment_methods }
  end
end
