require 'rails_helper'

RSpec.describe Bookings::SetCharges do
  subject(:service) { described_class.new(booking: booking, params: params) }

  context 'completed booking' do
    let(:booking) { create(:booking, :gett, :completed) }

    let(:params) do
      {
        stops_fee: 1,
        additional_fee: 2,
        run_in_fee: 3,
        booking_fee: 4,
        handling_fee: 5,
        phone_booking_fee: 6,
        international_booking_fee: 7,
        fare_cost: 8,
        paid_waiting_time_fee: 9,
        extra1: 10,
        extra2: 11,
        extra3: 12,
        tips: 13
      }
    end

    it 'calculates vat and totals' do
      service.execute
      charges = booking.charges
      expect(charges.values).to include(
        vat: 6,
        total_cost: 97,
        vatable_ride_fees: 0,
        non_vatable_ride_fees: 8,
        service_fees: 22,
        vatable_extra_fees: 6,
        non_vatable_extra_fees: 55
      )
    end
  end

  context 'cancelled booking' do
    let(:pickup) { create(:address, country_code: 'GB') }
    let(:booking) { create(:booking, :gett, :cancelled, pickup_address: pickup) }

    let(:params) do
      {
        cancellation_fee: 10,
        paid_waiting_time_fee: 2
      }
    end

    it 'calculates vat and totals' do
      service.execute
      charges = booking.charges
      expect(charges.values).to include(
        vat: 2,
        total_cost: 14,
        vatable_ride_fees: 10,
        non_vatable_ride_fees: 0,
        service_fees: 0,
        vatable_extra_fees: 0,
        non_vatable_extra_fees: 2
      )
    end
  end
end
