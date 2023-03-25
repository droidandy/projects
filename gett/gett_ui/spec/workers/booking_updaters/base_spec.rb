require 'rails_helper'

RSpec.describe BookingUpdaters::Base, type: :worker do
  let(:worker) { described_class.new }

  describe '#perform' do
    let(:booking)         { create(:booking, :order_received, scheduled_at: scheduled_at) }
    let(:scheduled_at)    { 1.hour.from_now }
    let(:updater_service) { double }

    before do
      allow(Bookings).to receive(:updater_for).with(booking).and_return(updater_service)
      expect(updater_service).to receive(:execute){ booking.update(status: updated_status) }
    end

    context 'when booking is not yet finalized' do
      let(:updated_status) { 'on_the_way' }

      before do
        allow(Sidekiq::ScheduledSet).to receive(:new).and_return(double(any?: false))
      end

      it 'schedules booking for next update' do
        expect(described_class).to receive(:perform_scheduled).with(booking.id)
        worker.perform(booking.id)
      end

      context 'but if this booking is beforehand' do
        let(:scheduled_at) { 6.hours.from_now }

        it 'does not schedule booking for next update - Sidekiq recurring worker takes care of it' do
          expect(described_class).not_to receive(:perform_scheduled)
          worker.perform(booking.id)
        end
      end
    end

    context 'when booking is finalized' do
      let(:updated_status) { 'completed' }

      it 'does not schedule booking for next update' do
        expect(described_class).not_to receive(:perform_scheduled)
        worker.perform(booking.id)
      end
    end
  end
end
