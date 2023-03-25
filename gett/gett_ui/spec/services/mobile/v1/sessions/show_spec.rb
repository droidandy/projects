require 'rails_helper'

describe Mobile::V1::Sessions::Show, type: :service do
  let(:member)  { create(:companyadmin, company: company) }
  let(:company) { create(:company) }

  subject(:service) { described_class.new(member: member, user: member) }

  describe '#future_bookings_count' do
    let(:company) { create(:company) }

    subject { service.execute.result[:future_bookings_count] }

    context 'member has future bookings' do
      let!(:booking1) { create(:booking, :locating, passenger: member) }
      let!(:booking2) { create(:booking, :scheduled, passenger: member, scheduled_at: 1.hour.from_now) }
      let!(:booking3) { create(:booking, :scheduled, passenger: member, scheduled_at: 2.hours.from_now) }
      let!(:booking4) { create(:booking, :scheduled, :completed, passenger: member, scheduled_at: 2.hours.from_now) }
      let!(:booking5) { create(:booking, :scheduled, :cancelled, passenger: member, scheduled_at: 2.hours.from_now) }
      let!(:booking6) { create(:booking, :scheduled, :rejected, passenger: member, scheduled_at: 2.hours.from_now) }

      it { is_expected.to eq(2) }
    end

    context 'member has no future bookings' do
      let!(:booking) { create(:booking, :order_received, passenger: member) }

      it { is_expected.to eq(0) }
    end
  end

  describe '#closest_future_booking_id' do
    let(:company) { create(:company) }

    subject { service.execute.result[:closest_future_booking_id] }

    context 'member has active bookings' do
      let!(:booking1) { create(:booking, :locating, passenger: member) }
      let!(:booking2) { create(:booking, :scheduled, passenger: member, scheduled_at: 1.hour.from_now) }
      let!(:booking3) { create(:booking, :scheduled, passenger: member, scheduled_at: 2.hours.from_now) }
      let!(:booking4) { create(:booking, :scheduled, :completed, passenger: member, scheduled_at: 30.minutes.from_now) }

      it { is_expected.to eq(booking2.id) }
    end

    context 'member has no active bookings' do
      let!(:booking) { create(:booking, :order_received, passenger: member) }

      it { is_expected.to be_nil }
    end
  end

  describe '#last_active_booking_id' do
    let(:company) { create(:company) }

    subject { service.execute.result[:active_booking_id] }

    context 'member has active bookings' do
      let!(:booking1) { create(:booking, :on_the_way, passenger: member) }
      let!(:booking2) { create(:booking, :locating, passenger: member) }

      it { is_expected.to eq(booking2.id) }
    end

    context 'member has no active bookings' do
      let!(:booking) { create(:booking, :order_received, passenger: member) }

      it { is_expected.to be_nil }
    end
  end
end
