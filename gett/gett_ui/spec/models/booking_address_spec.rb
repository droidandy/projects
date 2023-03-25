require 'rails_helper'

RSpec.describe BookingAddress do
  it { is_expected.to have_many_to_one(:booking) }
  it { is_expected.to have_many_to_one(:address) }

  describe '#after_create' do
    let(:booking) { build(:booking) }

    context 'when address_type is "pickup"' do
      let(:booking_address) { build(:booking_address, booking: booking, address_type: 'pickup') }

      before do
        booking.save
        allow(booking).to receive(:refresh_indexes)
      end

      it 'triggers booking index refresh' do
        booking_address.save
        expect(booking).to have_received(:refresh_indexes)
      end
    end
  end

  describe '#after_update' do
    let(:booking) { create(:booking) }

    before { allow(booking).to receive(:refresh_indexes) }

    context 'when address_type is "pickup" and address changed' do
      let(:booking_address) { booking.booking_addresses.find{ |ba| ba.address_type == 'pickup' } }
      let(:other_address) { create(:address) }

      it 'triggers index refresh on update' do
        booking_address.update(address: other_address)
        expect(booking).to have_received(:refresh_indexes)
      end
    end
  end
end
