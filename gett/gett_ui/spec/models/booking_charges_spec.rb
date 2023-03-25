require 'rails_helper'

RSpec.describe BookingCharges do
  it { is_expected.to have_many_to_one :booking }

  describe '#all_fees' do
    let(:charges) { create(:booking_charges, booking: booking, **charged_amounts) }
    let(:charged_amounts) do
      {
        cancellation_fee:          100,
        handling_fee:              100,
        booking_fee:               100,
        paid_waiting_time_fee:     100,
        phone_booking_fee:         100,
        tips:                      100,
        international_booking_fee: 100
      }
    end

    subject { charges.all_fees }

    context 'when booking is Gett' do
      let(:booking) { create(:booking, :gett) }
      let(:charged_amounts) do
        super().merge(stops_fee: 100, extra1: 50, extra2: 100, extra3: 150)
      end

      it { is_expected.to eq 1100 }
    end

    context 'when booking is OT' do
      let(:booking) { create(:booking, :ot) }

      it { is_expected.to eq 700 }
    end
  end

  describe '#all_costs' do
    let(:charges) { create(:booking_charges, booking: booking, fare_cost: 100, extra1: 100) }

    subject { charges.all_costs }

    context 'when booking is Gett' do
      let(:booking) { create(:booking, :gett) }

      it { is_expected.to eq 100 }
    end

    context 'when booking is OT' do
      let(:booking) { create(:booking, :ot) }

      it { is_expected.to eq 200 }
    end
  end

  describe '#paid_waiting_time_minutes' do
    let(:charges) { create(:booking_charges, paid_waiting_time: paid_waiting_time) }

    subject { charges.paid_waiting_time_minutes }

    context 'when paid_waiting_time is present' do
      let(:paid_waiting_time) { 61 }

      it { is_expected.to eq 1 }
    end

    context 'when paid_waiting_time is blank' do
      let(:paid_waiting_time) { nil }

      it { is_expected.to eq 0 }
    end
  end
end
