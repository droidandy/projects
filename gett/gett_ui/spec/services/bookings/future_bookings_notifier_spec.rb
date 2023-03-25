require 'rails_helper'

RSpec.describe Bookings::FutureBookingsNotifier, type: :service do
  let(:company) { create(:company) }
  let(:booker)  { create(:member, company: company) }
  let(:booking) { create(:booking, passenger: booker, company: company) }

  describe '#execute' do
    let(:service_double) { double(execute: double(result: 'some result')) }

    subject(:service) { described_class.new(booking: booking).with_context(member: booker) }

    stub_channelling!

    it 'notify if no bookings found' do
      expect(Faye).to receive(:notify).with(
        "active-bookings-info-#{booker.id}",
        future_bookings_count: 0,
        closest_future_booking_id: nil
      )
      service.execute
    end

    context 'when bookings exists' do
      before do
        @bookings = [
          create_booking_at(1.day.from_now),
          create_booking_at(2.days.from_now),
          create_booking_at(3.days.from_now)
        ]
      end

      def create_booking_at(scheduled_at)
        create(:booking, :scheduled, scheduled_at: scheduled_at, passenger: booker, company: company)
      end

      it 'notify if no bookings found' do
        expect(Faye).to receive(:notify).with(
          "active-bookings-info-#{booker.id}",
          future_bookings_count: 3,
          closest_future_booking_id: @bookings.first.id
        )
        service.execute
      end
    end
  end
end
