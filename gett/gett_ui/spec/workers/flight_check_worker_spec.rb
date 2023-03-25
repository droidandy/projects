require 'rails_helper'

RSpec.describe FlightCheckWorker, type: :worker do
  let(:worker) { described_class.new }

  before do
    create :booking, :scheduled, :with_flight, scheduled_at: 22.hours.from_now
    create :booking, :scheduled, :with_flight, scheduled_at: 13.hours.from_now
    create :booking, :scheduled, :with_flight, scheduled_at: 2.hours.from_now
    create :booking, :with_flight
    create :booking, :completed

    allow(Alerts::FlightChecker).to receive(:new).and_return(double(
      execute: double(success?: true),
      result: { 'status' => 'flight_cancelled' }
    ))

    worker.perform
  end

  describe FlightCheck::FastWorker, type: :worker do
    it 'calls Alerts::FlightChecker' do
      expect(Alerts::FlightChecker).to have_received(:new).once
    end
  end

  describe FlightCheck::SlowWorker, type: :worker do
    it 'calls Alerts::FlightChecker' do
      expect(Alerts::FlightChecker).to have_received(:new).twice
    end
  end
end
