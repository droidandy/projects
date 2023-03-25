require 'rails_helper'

RSpec.describe Admin::Statistics::BookingsQuery, type: :service do
  subject(:query) { described_class.new(query_params).values }

  let(:aff_company) { create :company, :affiliate }

  describe '#base_scope' do
    context 'empty params' do
      let(:query_params)          { {} }
      let(:real_company)          { create(:company, :real) }
      let(:fake_company)          { create(:company, :fake) }
      let!(:real_company_booking) { create(:booking, company_info: real_company.company_info) }
      let!(:fake_company_booking) { create(:booking, company_info: fake_company.company_info) }

      its(:count) { is_expected.to eq 1 }
    end

    context 'without payment cards' do
      let!(:booking)                       { create(:booking) }
      let!(:personal_payment_card_booking) { create(:booking, :payment_by_personal_card, payment_card: create(:payment_card)) }
      let!(:business_payment_card_booking) { create(:booking, :payment_by_card, payment_card: create(:payment_card)) }

      let(:query_params)                   { { without_payment_cards: true } }

      its(:count) { is_expected.to eq 3 }
    end
  end

  describe '#active' do
    let!(:asap_booking_1) { create(:booking, :asap, :order_received) }
    let!(:asap_booking_2) { create(:booking, :asap, :locating) }
    let!(:asap_booking_3) { create(:booking, :asap, :arrived) }
    let!(:asap_booking_4) { create(:booking, :asap, :on_the_way) }
    let!(:asap_booking_5) { create(:booking, :asap, :in_progress) }
    let!(:asap_booking_6) { create(:booking, :asap, :completed) }

    let!(:future_booking_1) { create(:booking, :scheduled, :order_received) }
    let!(:future_booking_2) { create(:booking, :scheduled, :arrived) }
    let!(:future_booking_3) { create(:booking, :scheduled, :on_the_way) }
    let!(:future_booking_4) { create(:booking, :scheduled, :in_progress) }
    let!(:future_booking_5) { create(:booking, :scheduled, :completed) }
    let!(:future_booking_6) { create(:booking, :scheduled, :locating) }

    let(:query_params) { { active: true, group: 'schedule_type', count: 'all' } }
    let(:values) do
      [
        { name: true, value: 4 },
        { name: false, value: 4 }
      ]
    end
    it { is_expected.to match_array values }
  end

  describe '#future' do
    let!(:ent_booking_1) { create(:booking, :order_received) }
    let!(:ent_booking_2) { create(:booking, :order_received) }
    let!(:ent_booking_3) { create(:booking, :arrived) }
    let!(:ent_booking_4) { create(:booking, :on_the_way) }
    let!(:ent_booking_5) { create(:booking, :order_received, scheduled_at: Date.current - 3.days) }
    let!(:ent_booking_6) { create(:booking, :completed) }
    let!(:ent_booking_7) { create(:booking, :order_received, scheduled_at: Date.current - 2.days) }

    let!(:aff_booking_1) { create(:booking, :order_received, company_info: aff_company.company_info) }
    let!(:aff_booking_2) { create(:booking, :arrived, company_info: aff_company.company_info) }
    let!(:aff_booking_3) { create(:booking, :order_received, scheduled_at: Date.current - 2.days, company_info: aff_company.company_info) }
    let!(:aff_booking_4) { create(:booking, :order_received, scheduled_at: Date.current - 3.days, company_info: aff_company.company_info) }
    let!(:aff_booking_5) { create(:booking, :completed, company_info: aff_company.company_info) }

    let(:query_params) { { future: true, group: 'company_type', count: 'all' } }
    let(:values) do
      [
        { name: 'enterprise', value: 4 },
        { name: 'affiliate', value: 3 }
      ]
    end

    it { is_expected.to match_array values }
  end

  describe '#current_day' do
    let!(:ent_booking_1) { create(:booking) }
    let!(:ent_booking_2) { create(:booking, status: 'in_progress') }
    let!(:ent_booking_3) { create(:booking, scheduled_at: Date.current - 2.days) }
    let!(:aff_booking_1) { create(:booking, company_info: aff_company.company_info) }
    let!(:aff_booking_2) { create(:booking, status: 'in_progress', company_info: aff_company.company_info) }
    let!(:aff_booking_3) { create(:booking, scheduled_at: Date.current - 2.days, company_info: aff_company.company_info) }
    let!(:aff_booking_4) { create(:booking, company_info: aff_company.company_info) }

    let(:query_params) do
      {for_period: Date.current.beginning_of_day..Date.current.end_of_day, group: 'company_type', count: 'all'}
    end

    let(:values) do
      [
        { name: 'enterprise', value: 2 },
        { name: 'affiliate', value: 3 }
      ]
    end

    it { is_expected.to match_array values }
  end

  describe '#average_rating' do
    let(:company)      { create(:company) }
    let!(:booking_1)   { create(:booking, company: company) }
    let!(:booking_2)   { create(:booking, company: company) }
    let!(:booking_3)   { create(:booking, company: company) }
    let!(:booking_4)   { create(:booking, company: company) }

    let!(:driver_1)    { create(:booking_driver, booking: booking_1, trip_rating: 2) }
    let!(:driver_2)    { create(:booking_driver, booking: booking_2, trip_rating: 3) }

    let!(:feedback_1)  { create(:feedback, booking: booking_3, rating: 5) }
    let!(:feedback_2)  { create(:feedback, booking: booking_4, rating: 4) }
    let!(:feedback_3)  { create(:feedback, booking: booking_4, rating: 2) }

    let(:query_params) { { average_rating: true } }

    let(:values) do
      [
        { name: 'driver', value: 2.5 },
        { name: 'service', value: 3.7 }
      ]
    end

    it { is_expected.to match_array values }
  end
end
