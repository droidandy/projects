require 'rails_helper'

RSpec.describe OTBookingsStatusUpdater do
  let(:worker) { OTBookingsStatusUpdater.new }

  describe 'batch processing' do
    before do
      expect(Booking).to receive_message_chain(:ot, :fully_created, :not_final, :pluck)
        .and_return((1..60).to_a)

      expect(Bookings::OTBookingsStatusUpdater).to receive(:new)
        .with(external_references: (1..50).to_a)
        .and_return(double(execute: true))

      expect(Bookings::OTBookingsStatusUpdater).to receive(:new)
        .with(external_references: (51..60).to_a)
        .and_return(double(execute: true))
    end

    it 'processes bookings in batches' do
      worker.perform
    end
  end
end
