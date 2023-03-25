require 'rails_helper'

RSpec.describe Bookings::Rate, type: :service do
  let(:booking)        { create(:booking, status: :on_the_way) }
  let(:booking_driver) { create(:booking_driver, booking: booking) }

  subject(:service) { described_class.new(booking: booking, params: params) }
  let(:params) { { rating: '5' } }

  service_context { { member: booking.booker, company: booking.booker.company } }

  it { is_expected.to be_authorized_by Bookings::ShowPolicy }

  before { allow(Faye.bookings).to receive(:notify_update) }

  it 'updates trip rating and notifies faye' do
    expect{ subject.execute }.to change{ booking_driver.reload.trip_rating }.from(nil).to(5)
    expect(Faye.bookings).to have_received(:notify_update)
  end

  context 'when rating reasons are present in params' do
    let(:rating_reasons) { ['traffic', 'app'] }
    let(:params) { { rating: '5', rating_reasons: rating_reasons } }

    it 'updates trip rating and notifies faye' do
      expect{ subject.execute }.to change{ booking_driver.reload.trip_rating }.from(nil).to(5)
      expect(Faye.bookings).to have_received(:notify_update)
    end

    it 'assigns rating reasons to booking driver' do
      expect{ subject.execute }.to change{ booking_driver.reload.rating_reasons.count }.from(0).to(2)
      expect(booking_driver.rating_reasons).to match_array rating_reasons
    end
  end

  context 'booking is not in a rateable status' do
    let(:booking) { create(:booking, status: :locating) }

    it 'does not update trip rating' do
      expect{ subject.execute }.to_not change{ booking_driver.reload.trip_rating }
    end
  end

  context 'booking is already rated' do
    let(:booking_driver) { create(:booking_driver, booking: booking, trip_rating: 3) }

    it 'does not update trip rating' do
      expect{ subject.execute }.to_not change{ booking_driver.reload.trip_rating }
    end
  end
end
