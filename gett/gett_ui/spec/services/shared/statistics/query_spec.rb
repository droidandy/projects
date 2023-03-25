require 'rails_helper'

RSpec.describe Shared::Statistics::Query, type: :service do
  let(:today)                     { Date.current }
  let(:yesterday)                 { today - 1.day }
  let(:current_month_beginning)   { Date.current.beginning_of_month }
  let(:previous_month_beginning)  { (Date.current - 1.month).beginning_of_month }
  let(:two_months_ago_beginning)  { (Date.current - 2.months).beginning_of_month }
  let(:current_month_the_second)  { current_month_beginning + 1.day }
  let(:previous_month_the_second) { previous_month_beginning + 1.day }
  let(:two_months_ago_the_third)  { two_months_ago_beginning + 2.days }

  subject(:query) { described_class.new(query_params).values }

  describe '#base_scope' do
    let(:query_params)                   { {} }
    let!(:personal_payment_card_booking) { create(:booking, :payment_by_personal_card, payment_card: create(:payment_card)) }
    let!(:business_payment_card_booking) { create(:booking, :payment_by_card, payment_card: create(:payment_card)) }

    its(:count) { is_expected.to eq 1 }
  end

  describe '#group' do
    context 'month, date, day' do
      let!(:booking_1) { create(:booking, :completed, scheduled_at: current_month_beginning, created_at: current_month_beginning) }
      let!(:booking_2) { create(:booking, :completed, scheduled_at: current_month_beginning, created_at: previous_month_the_second) }
      let!(:booking_3) { create(:booking, :completed, scheduled_at: previous_month_beginning, created_at: two_months_ago_beginning) }
      let!(:booking_4) { create(:booking, :rejected, scheduled_at: current_month_beginning, created_at: current_month_beginning) }
      let!(:booking_5) { create(:booking, :rejected, scheduled_at: current_month_beginning, created_at: previous_month_the_second) }
      let!(:booking_6) { create(:booking, :rejected, scheduled_at: previous_month_the_second, created_at: two_months_ago_beginning) }
      let!(:booking_7) { create(:booking, :cancelled, scheduled_at: current_month_beginning, created_at: current_month_beginning) }
      let!(:booking_8) { create(:booking, :cancelled, scheduled_at: current_month_beginning, created_at: previous_month_beginning) }
      let!(:booking_9) { create(:booking, :cancelled, scheduled_at: two_months_ago_the_third, created_at: two_months_ago_beginning) }

      describe 'month' do
        let(:query_params) { { group: 'month', count: 'all' } }
        let(:values) do
          [
            { date: current_month_beginning, value: 6 },
            { date: previous_month_beginning, value: 2 },
            { date: two_months_ago_beginning, value: 1 }
          ]
        end

        it { is_expected.to match_array values }
      end

      describe 'date' do
        let(:query_params) { { group: 'date', count: 'all' } }
        let(:values) do
          [
            { date: current_month_beginning, value: 6 },
            { date: previous_month_beginning, value: 1 },
            { date: previous_month_the_second, value: 1 },
            { date: two_months_ago_the_third, value: 1 }
          ]
        end

        it { is_expected.to match_array values }
      end

      describe 'day' do
        let(:query_params) { { group: 'day', count: 'all' } }
        let(:values) do
          [
            { date: 1.0, value: 7 },
            { date: 2.0, value: 1 },
            { date: 3.0, value: 1 }
          ]
        end

        it { is_expected.to match_array values }
      end
    end

    describe 'vehicle_name' do
      let(:vehicle_1)  { create(:vehicle, :gett, name: 'name_1') }
      let(:vehicle_2)  { create(:vehicle, :gett, name: 'name_2') }
      let(:vehicle_3)  { create(:vehicle, :gett, name: 'name_3') }
      let!(:booking_1) { create(:booking, vehicle: vehicle_1) }
      let!(:booking_2) { create(:booking, vehicle: vehicle_1) }
      let!(:booking_3) { create(:booking, vehicle: vehicle_2) }
      let!(:booking_4) { create(:booking, vehicle: vehicle_2) }
      let!(:booking_5) { create(:booking, vehicle: vehicle_2) }
      let!(:booking_6) { create(:booking, vehicle: vehicle_3) }

      let(:query_params) { { group: 'vehicle_name', count: 'all' } }
      let(:values) do
        [
          { name: 'name_1', value: 2 },
          { name: 'name_2', value: 3 },
          { name: 'name_3', value: 1 }
        ]
      end

      it { is_expected.to match_array values }
    end

    describe 'schedule_type' do
      let!(:booking_1) { create(:booking, :asap) }
      let!(:booking_2) { create(:booking, :asap) }
      let!(:booking_3) { create(:booking, :asap) }
      let!(:booking_4) { create(:booking, :scheduled) }
      let!(:booking_5) { create(:booking, :scheduled) }
      let!(:booking_6) { create(:booking, :scheduled) }
      let!(:booking_7) { create(:booking, :scheduled) }

      let(:query_params) { { group: 'schedule_type', count: 'all' } }
      let(:values) do
        [
          { name: true, value: 3 },
          { name: false, value: 4 }
        ]
      end

      it { is_expected.to match_array values }
    end

    describe 'company_type' do
      let(:aff_company) { create(:company, :affiliate) }

      let!(:booking_1) { create(:booking) }
      let!(:booking_2) { create(:booking) }
      let!(:booking_3) { create(:booking) }
      let!(:booking_4) { create(:booking, company: aff_company) }
      let!(:booking_5) { create(:booking, company: aff_company) }
      let!(:booking_6) { create(:booking, company: aff_company) }
      let!(:booking_7) { create(:booking, company: aff_company) }

      let(:query_params) { { group: 'company_type', count: 'all' } }
      let(:values) do
        [
          { name: 'enterprise', value: 3 },
          { name: 'affiliate', value: 4 }
        ]
      end

      it { is_expected.to match_array values }
    end

    describe 'city' do
      let(:london_address)   { create(:address, city: 'London') }
      let(:new_york_address) { create(:address, city: 'New York') }
      let(:tokyo_address)    { create(:address, city: 'Tokyo') }
      let!(:booking_1)       { create(:booking, pickup_address: london_address) }
      let!(:booking_2)       { create(:booking, pickup_address: london_address) }
      let!(:booking_3)       { create(:booking, pickup_address: london_address) }
      let!(:booking_4)       { create(:booking, pickup_address: new_york_address) }
      let!(:booking_5)       { create(:booking, pickup_address: new_york_address) }
      let!(:booking_6)       { create(:booking, pickup_address: tokyo_address) }

      let(:query_params) { { group: 'city', count: 'all' } }
      let(:values) do
        [
          { name: 'London', value: 3 },
          { name: 'New York', value: 2 },
          { name: 'Tokyo', value: 1 }
        ]
      end

      it { is_expected.to match_array values }
    end

    describe 'company' do
      let(:company_1)       { create(:company) }
      let(:company_2)       { create(:company) }
      let!(:company_info_1) { create(:company_info, name: 'company_name_1', active: false, company_id: company_1.id) }
      let!(:company_info_2) { create(:company_info, name: 'company_name_2', active: false, company_id: company_1.id) }
      let!(:company_info_3) { create(:company_info, name: 'company_name_3', active: false, company_id: company_2.id) }
      let!(:booking_1)      { create(:booking, company_info_id: company_info_1.id) }
      let!(:booking_2)      { create(:booking, company_info_id: company_info_2.id) }
      let!(:booking_3)      { create(:booking, company_info_id: company_info_3.id) }

      let(:query_params) { { group: 'company_name', count: 'all' } }
      let(:values) do
        [
          { name: company_1.name, value: 2 },
          { name: company_2.name, value: 1 }
        ]
      end

      it { is_expected.to match_array values }
    end
  end

  describe 'count' do
    describe 'vehicle_name' do
      let(:vehicle_1)  { create(:vehicle, :gett, name: 'name_1') }
      let(:vehicle_2)  { create(:vehicle, :gett, name: 'name_2') }
      let(:vehicle_3)  { create(:vehicle, :gett, name: 'name_3') }
      let!(:booking_1) { create(:booking, vehicle: vehicle_1) }
      let!(:booking_2) { create(:booking, vehicle: vehicle_1, scheduled_at: yesterday) }
      let!(:booking_3) { create(:booking, vehicle: vehicle_2, scheduled_at: yesterday) }
      let!(:booking_4) { create(:booking, vehicle: vehicle_2) }
      let!(:booking_5) { create(:booking, vehicle: vehicle_2) }
      let!(:booking_6) { create(:booking, vehicle: vehicle_3) }

      let(:query_params) do
        {
          group: 'date',
          count: { column: 'vehicle_name', values: ['name_1', 'name_3', 'name_2'] }
        }
      end

      let(:values) do
        [
          { date: today, name_1: 1, name_3: 1, name_2: 2 },
          { date: yesterday, name_1: 1, name_3: 0, name_2: 1 }
        ]
      end

      it { is_expected.to match_array values }
    end

    describe 'payment_method' do
      let(:payment_method_1) { 'account' }
      let(:payment_method_2) { 'cash' }
      let(:payment_method_3) { 'personal_payment_card' }
      let(:payment_card)     { create(:payment_card) }
      let!(:booking_1)       { create(:booking, payment_method: payment_method_1) }
      let!(:booking_2)       { create(:booking, payment_method: payment_method_1, scheduled_at: yesterday) }
      let!(:booking_3)       { create(:booking, payment_method: payment_method_2, scheduled_at: yesterday) }
      let!(:booking_4)       { create(:booking, payment_method: payment_method_2) }
      let!(:booking_5)       { create(:booking, payment_method: payment_method_2, scheduled_at: yesterday) }
      let!(:booking_6)       { create(:booking, payment_method: payment_method_3, payment_card: payment_card) }

      let(:query_params) do
        {
          group: 'date',
          count: { column: 'payment_method', values: ['account', 'cash', 'personal_payment_card'] }
        }
      end

      let(:values) do
        [
          { date: today, account: 1, cash: 1, personal_payment_card: 0 },
          { date: yesterday, account: 1, cash: 2, personal_payment_card: 0 }
        ]
      end

      it { is_expected.to match_array values }
    end

    describe 'status' do
      let!(:booking_1) { create(:booking, :completed) }
      let!(:booking_2) { create(:booking, :completed, scheduled_at: yesterday) }
      let!(:booking_3) { create(:booking, :cancelled, scheduled_at: yesterday) }
      let!(:booking_4) { create(:booking, :cancelled) }
      let!(:booking_5) { create(:booking, :cancelled) }
      let!(:booking_6) { create(:booking, :rejected, scheduled_at: yesterday) }

      let(:query_params) do
        {
          group: 'date',
          count: { column: 'status', values: ['completed', 'cancelled', 'rejected'] }
        }
      end

      let(:values) do
        [
          { date: today, completed: 1, cancelled: 2, rejected: 0 },
          { date: yesterday, completed: 1, cancelled: 1, rejected: 1 }
        ]
      end

      it { is_expected.to match_array values }
    end

    describe 'default' do
      let!(:booking_1) { create(:booking, :completed) }
      let!(:booking_2) { create(:booking, :completed, scheduled_at: yesterday) }
      let!(:booking_3) { create(:booking, :cancelled, scheduled_at: yesterday) }
      let!(:booking_4) { create(:booking, :cancelled) }
      let!(:booking_5) { create(:booking, :cancelled) }
      let!(:booking_6) { create(:booking, :rejected, scheduled_at: yesterday) }

      let(:query_params) { { group: 'date', count: 'all' } }
      let(:values) do
        [
          { date: today, value: 3 },
          { date: yesterday, value: 3 }
        ]
      end

      it { is_expected.to match_array values }
    end
  end

  describe 'spend' do
    describe 'booking_type' do
      let!(:booking_1) { create(:booking, phone_booking: true, total_cost: 100) }
      let!(:booking_2) { create(:booking, phone_booking: true, total_cost: 200, scheduled_at: yesterday) }
      let!(:booking_3) { create(:booking, phone_booking: true, total_cost: 300) }
      let!(:booking_4) { create(:booking, total_cost: 1000, scheduled_at: yesterday) }
      let!(:booking_5) { create(:booking, total_cost: 2000) }
      let!(:booking_6) { create(:booking, total_cost: 3000) }
      let!(:booking_7) { create(:booking, total_cost: 4000) }

      let(:query_params) { { group: 'date', spend: 'booking_type' } }
      let(:values) do
        [
          { date: today, phone: 4, web: 90  },
          { date: yesterday, phone: 2, web: 10 }
        ]
      end

      it { is_expected.to match_array values }
    end

    describe 'current_and_previous_month' do
      let!(:booking_1) { create(:booking, total_cost: 100, scheduled_at: current_month_beginning) }
      let!(:booking_2) { create(:booking, total_cost: 200, scheduled_at: previous_month_beginning) }
      let!(:booking_3) { create(:booking, total_cost: 300, scheduled_at: current_month_beginning) }
      let!(:booking_4) { create(:booking, total_cost: 1000, scheduled_at: previous_month_beginning) }
      let!(:booking_5) { create(:booking, total_cost: 2000, scheduled_at: current_month_the_second) }
      let!(:booking_6) { create(:booking, total_cost: 3000, scheduled_at: previous_month_the_second) }
      let!(:booking_7) { create(:booking, total_cost: 4000, scheduled_at: two_months_ago_the_third) }

      let(:query_params) { { group: 'day', spend: 'current_and_previous_month' } }
      let(:values) do
        [
          { date: 1.0, current: 4, previous: 12  },
          { date: 2.0, current: 20, previous: 30 },
          { date: 3.0, current: 0, previous: 0}
        ]
      end

      it { is_expected.to match_array values }
    end

    describe 'all' do
      let!(:booking_1) { create(:booking, total_cost: 100, scheduled_at: current_month_beginning) }
      let!(:booking_2) { create(:booking, total_cost: 200, scheduled_at: previous_month_beginning) }
      let!(:booking_3) { create(:booking, total_cost: 300, scheduled_at: current_month_beginning) }
      let!(:booking_4) { create(:booking, total_cost: 1000, scheduled_at: previous_month_beginning) }
      let!(:booking_5) { create(:booking, total_cost: 2000, scheduled_at: current_month_the_second) }
      let!(:booking_6) { create(:booking, total_cost: 3000, scheduled_at: previous_month_the_second) }
      let!(:booking_7) { create(:booking, total_cost: 4000, scheduled_at: two_months_ago_the_third) }

      let(:query_params) { { group: 'day', spend: 'all' } }
      let(:values) do
        [
          { date: 1.0, spend: 16 },
          { date: 2.0, spend: 50 },
          { date: 3.0, spend: 40 }
        ]
      end

      it { is_expected.to match_array values }
    end

    describe 'waiting_cost' do
      let!(:booking_1) { create(:booking, scheduled_at: Date.current) }
      let!(:booking_2) { create(:booking, scheduled_at: Date.current) }
      let!(:booking_3) { create(:booking, scheduled_at: Date.current) }

      before do
        create(:booking_charges, booking: booking_1, paid_waiting_time_fee: 1000)
        create(:booking_charges, booking: booking_2, paid_waiting_time_fee: 2000)
        create(:booking_charges, booking: booking_3, paid_waiting_time_fee: 3000)
      end

      let(:query_params) { { group: 'month', spend: 'waiting_cost' } }
      let(:values) do
        [{ date: Date.current.beginning_of_month, spend: 60 }]
      end

      it { is_expected.to match_array values }
    end

    describe 'average_cost_per_vehicle' do
      let(:vehicle_1)  { create(:vehicle, :gett, name: 'name_1') }
      let(:vehicle_2)  { create(:vehicle, :gett, name: 'name_2') }
      let(:vehicle_3)  { create(:vehicle, :gett, name: 'name_3') }
      let!(:booking_1) { create(:booking, scheduled_at: Date.current, total_cost: 100, vehicle: vehicle_1) }
      let!(:booking_2) { create(:booking, scheduled_at: Date.current, total_cost: 200, vehicle: vehicle_1) }
      let!(:booking_3) { create(:booking, scheduled_at: Date.current, total_cost: 377, vehicle: vehicle_1) }
      let!(:booking_4) { create(:booking, scheduled_at: Date.current, total_cost: 1000, vehicle: vehicle_2) }
      let!(:booking_5) { create(:booking, scheduled_at: Date.current, total_cost: 2000, vehicle: vehicle_2) }
      let!(:booking_6) { create(:booking, scheduled_at: Date.current, total_cost: 3000, vehicle: vehicle_3) }

      let(:query_params) { { group: 'month', spend: { column: 'average_cost_per_vehicle', values: ['name_1', 'name_2', 'name_3', 'name_4'] } } }
      let(:values) do
        [{ date: Date.current.beginning_of_month, name_1: 2, name_2: 15, name_3: 30, name_4: 0 }]
      end

      it { is_expected.to match_array values }
    end
  end
end
