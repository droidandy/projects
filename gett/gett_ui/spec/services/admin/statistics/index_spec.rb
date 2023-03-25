require 'rails_helper'

RSpec.describe Admin::Statistics::Index, type: :service do
  let(:admin) { create(:user) }
  subject(:service) { described_class.new }

  service_context { { admin: admin } }

  before { Timecop.freeze('2018-01-01 12:00') }
  after  { Timecop.return }

  describe '#execute' do
    let(:now)                { Time.current + 10.minutes }
    let(:today)              { Date.current }
    let(:yesterday)          { today - 1.day }
    let(:tomorrow)           { today + 1.day }
    let(:enterprise_company) { create(:company, :enterprise) }
    let(:affiliate_company)  { create(:company, :affiliate) }
    let(:bbc_company)        { create(:company, :bbc) }

    let!(:ent_booking_1)  { create(:booking, :asap, :order_received, scheduled_at: today, company: enterprise_company) }
    let!(:ent_booking_2)  { create(:booking, :asap, :locating, scheduled_at: today, company: enterprise_company) }
    let!(:ent_booking_3)  { create(:booking, :asap, :arrived, scheduled_at: today, company: enterprise_company) }
    let!(:ent_booking_4)  { create(:booking, :asap, :on_the_way, scheduled_at: today, company: enterprise_company) }
    let!(:ent_booking_5)  { create(:booking, :asap, :in_progress, scheduled_at: today, company: enterprise_company) }
    let!(:ent_booking_6)  { create(:booking, :asap, :in_progress, scheduled_at: yesterday, company: enterprise_company) }

    let!(:ent_booking_7)  { create(:booking, :scheduled, :order_received, scheduled_at: now, company: enterprise_company) }
    let!(:ent_booking_8)  { create(:booking, :scheduled, :locating, scheduled_at: now, company: enterprise_company) }
    let!(:ent_booking_9)  { create(:booking, :scheduled, :arrived, scheduled_at: now, company: enterprise_company) }
    let!(:ent_booking_10) { create(:booking, :scheduled, :on_the_way, scheduled_at: now, company: enterprise_company) }
    let!(:ent_booking_11) { create(:booking, :scheduled, :in_progress, scheduled_at: now, company: enterprise_company) }
    let!(:ent_booking_12) { create(:booking, :scheduled, :in_progress, scheduled_at: tomorrow, company: enterprise_company) }
    let!(:ent_booking_13) { create(:booking, :scheduled, :completed, scheduled_at: now, company: enterprise_company) }

    let!(:bbc_booking_1)  { create(:booking, :scheduled, :completed, scheduled_at: now, company: bbc_company) }

    let!(:aff_booking_1)  { create(:booking, :asap, :order_received, scheduled_at: today, company: affiliate_company) }
    let!(:aff_booking_2)  { create(:booking, :asap, :locating, scheduled_at: today, company: affiliate_company) }
    let!(:aff_booking_3)  { create(:booking, :asap, :arrived, scheduled_at: today, company: affiliate_company) }
    let!(:aff_booking_4)  { create(:booking, :asap, :on_the_way, scheduled_at: today, company: affiliate_company) }
    let!(:aff_booking_5)  { create(:booking, :asap, :in_progress, scheduled_at: today, company: affiliate_company) }
    let!(:aff_booking_6)  { create(:booking, :asap, :in_progress, scheduled_at: yesterday, company: affiliate_company) }

    let!(:aff_booking_7)  { create(:booking, :scheduled, :order_received, scheduled_at: now, company: affiliate_company) }
    let!(:aff_booking_8)  { create(:booking, :scheduled, :locating, scheduled_at: now, company: affiliate_company) }
    let!(:aff_booking_9)  { create(:booking, :scheduled, :arrived, scheduled_at: now, company: affiliate_company) }
    let!(:aff_booking_10) { create(:booking, :scheduled, :on_the_way, scheduled_at: now, company: affiliate_company) }
    let!(:aff_booking_11) { create(:booking, :scheduled, :in_progress, scheduled_at: now, company: affiliate_company) }
    let!(:aff_booking_12) { create(:booking, :scheduled, :in_progress, scheduled_at: tomorrow, company: affiliate_company) }
    let!(:aff_booking_13) { create(:booking, :scheduled, :rejected, scheduled_at: now, company: affiliate_company) }

    context 'execution result' do
      before { service.execute }
      it { is_expected.to be_success }
      its(:result) do
        is_expected.to include(
          :enterprise_active_by_schedule_type,
          :affiliate_active_by_schedule_type,
          :scheduled_by_company_type,
          :enterprise_by_status,
          :affiliate_by_status,
          :completed_by_service_type,
          :international_by_status,
          :cash_by_status,
          :account_by_status,
          :credit_by_status,
          :bookers_by_company_type,
          :passengers_by_company_type,
          :companies_by_company_type,
          :first_time_passengers_by_company_type,
          :average_rating,
          :affiliate_daily,
          :affiliate_monthly,
          :enterprise_daily,
          :enterprise_monthly
        )
      end

      describe 'result hash values' do
        subject { service.result }

        its([:enterprise_active_by_schedule_type]) { is_expected.to eq [{ name: 'asap', value: 5 }, { name: 'future', value: 5 }] }
        its([:affiliate_active_by_schedule_type])  { is_expected.to eq [{ name: 'asap', value: 5 }, { name: 'future', value: 5 }] }
        its([:scheduled_by_company_type])          { is_expected.to eq [{ name: 'enterprise', value: 12 }, { name: 'affiliate', value: 11 }] }
      end
    end
  end
end
