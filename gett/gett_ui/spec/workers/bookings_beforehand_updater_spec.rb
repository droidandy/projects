require 'rails_helper'

RSpec.describe BookingsBeforehandUpdater, type: :worker do
  let(:worker) { BookingsBeforehandUpdater.new }

  describe '#perform' do
    before do
      create(:booking, :ot, :order_received, scheduled_at: 10.hours.from_now)
      create(:booking, :gett, :order_received, scheduled_at: 4.hours.from_now)
    end

    it 'runs updaters for beforehand bookings, but not for ones that scheduled soon' do
      expect(BookingUpdaters::Gett).not_to receive(:perform_async)
      expect(BookingUpdaters::OT).to receive(:perform_async)

      worker.perform
    end
  end
end
