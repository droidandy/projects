require 'rails_helper'

RSpec.describe BookingsChargesUpdater, type: :worker do
  let(:worker) { BookingsChargesUpdater.new }

  context 'when Gett booking' do
    let(:booking) { create(:booking, :gett) }
    let(:gett_updater) { double('Bookings::ChargesUpdaters::Gett') }

    it 'runs Gett cost updater' do
      expect(Bookings::ChargesUpdaters::Gett).to receive(:new)
        .with(booking: booking).and_return(gett_updater)
      expect(gett_updater).to receive(:execute)

      worker.perform(booking.id)
    end
  end

  context 'when OT booking' do
    let(:booking) { create(:booking, :ot) }
    let(:ot_updater) { double('Bookings::ChargesUpdaters::OT') }

    it 'runs OT cost updater' do
      expect(Bookings::ChargesUpdaters::OT).to receive(:new)
        .with(booking: booking).and_return(ot_updater)
      expect(ot_updater).to receive(:execute)

      worker.perform(booking.id)
    end
  end

  context 'when Manual booking' do
    let(:booking) { create(:booking, :manual) }
    let(:manual_updater) { double('Bookings::ChargesUpdaters::Manual') }

    it 'runs Manual cost updater' do
      expect(Bookings::ChargesUpdaters::Manual).to receive(:new)
        .with(booking: booking).and_return(manual_updater)
      expect(manual_updater).to receive(:execute)

      worker.perform(booking.id)
    end
  end

  context 'when Carey booking' do
    let(:booking) { create(:booking, :carey) }
    let(:carey_updater) { double('Bookings::ChargesUpdaters::Carey') }

    it 'runs carey cost updater' do
      expect(Bookings::ChargesUpdaters::Carey).to receive(:new)
        .with(booking: booking).and_return(carey_updater)
      expect(carey_updater).to receive(:execute)

      worker.perform(booking.id)
    end
  end
end
