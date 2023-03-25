require 'rails_helper'

RSpec.describe BookingUpdaters::Splyt, type: :worker do
  subject(:worker) { described_class.new }

  let(:booking) { create(:booking, :splyt) }

  context '#perform' do
    context 'when there is no booking' do
      it 'retuns nil' do
        expect(worker.perform(666)).to be nil
      end
    end

    context 'when there is a booking' do
      context 'when updater class is found' do
        let(:updater) { double(:updater, blank?: false, execute: true) }
        let(:set)     { [job] }
        let(:job)     { double(:job, klass: 'MegaJob') }

        before do
          allow(Bookings).to receive(:updater_for).with(booking).and_return(updater)
          allow(Sidekiq::ScheduledSet).to receive(:new).and_return(set)
        end

        it 'builds an updater and executes it' do
          expect(Bookings).to receive(:updater_for).with(booking).and_return(updater)
          expect(updater).to  receive(:execute)

          worker.perform(booking.id)
        end

        context 'when a booking is not final and there are no jobs for it' do
          it 'schedules new job for the booking' do
            expect(described_class).to receive(:perform_scheduled).with(booking.id)

            worker.perform(booking.id)
          end
        end
      end

      context 'when updater class is not found' do
        it 'returns nil' do
          expect(Bookings).to receive(:updater_for).with(booking).and_return(nil)

          expect(worker.perform(booking.id)).to be nil
        end
      end
    end
  end
end
