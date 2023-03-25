require 'rails_helper'

RSpec.describe BookingPayments::Repeat, type: :service do
  let(:booking) { create(:booking) }
  subject(:service) { BookingPayments::Repeat.new(booking: booking) }

  describe '#execute' do
    context 'booking has no payments' do
      it 'schedules a retry' do
        expect(BookingPaymentsWorker).to receive(:perform_in).with(1.day, booking.id)
        service.execute
      end
    end

    context 'booking has a payment' do
      let!(:payment) { create(:payment, booking: booking, retries: 1) }

      it 'schedules a retry and increments retires counter' do
        expect(BookingPaymentsWorker).to receive(:perform_in).with(5.days, booking.id)
        service.execute
        expect(payment.reload.retries).to eq(2)
      end

      context 'payment is out of retries' do
        let!(:payment) { create(:payment, booking: booking, retries: 4) }

        it 'does not schedule a retry' do
          expect(BookingPaymentsWorker).to_not receive(:perform_in)
          service.execute
        end
      end
    end
  end
end
