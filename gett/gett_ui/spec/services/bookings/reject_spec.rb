require 'rails_helper'

RSpec.describe Bookings::Reject, type: :service do
  describe '#execute' do
    service_context { { member: booker } }
    stub_channelling!

    let(:booker) { create :booker }

    subject(:service) { Bookings::Reject.new(booking: booking) }

    describe 'execute' do
      let(:booking) { create :booking, status: 'creating' }

      before do
        allow(Faye.bookings).to receive(:notify_update)
      end

      context 'when booking is not rejectable' do
        let(:booking) { create :booking, status: 'in_progress' }
        it { is_expected.not_to be_success }
      end

      it { is_expected.not_to be_success }

      it 'updates booking status and rejected_at' do
        expect{ service.execute }.to change{ booking.status }.from('creating').to('rejected')
        expect(booking.rejected_at).to be_present
      end

      it 'notifies Faye' do
        expect(Faye.bookings).to receive(:notify_update)
        service.execute
      end

      context 'calls Bookings::FutureBookingsNotifier' do
        it do
          expect(::Bookings::FutureBookingsNotifier).to receive_message_chain(:new, :execute)
          service.execute
        end

        it 'and notifies Faye' do
          expect(Faye).to receive(:notify)
          service.execute
        end
      end
    end
  end
end
