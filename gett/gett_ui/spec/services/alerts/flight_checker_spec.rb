require 'rails_helper'

RSpec.describe Alerts::FlightChecker, type: :service do
  subject(:service) { described_class.new(booking: booking) }

  let(:flight_status)  { 'flight_cancelled' }
  let(:success_double) { double(execute: double(success?: true)) }

  before do
    allow(Alerts::Create).to receive(:new).and_return(success_double)
    allow(Alerts::Remove).to receive(:new).and_return(success_double)
    allow(Bookings::PushNotification).to receive(:new).and_return(success_double)
    allow(Flightstats::Status).to receive(:new).and_return(double(
      execute: double(success?: true),
      result: { status: flight_status }
    ))
  end

  let(:booking) { create(:booking, :scheduled, :with_flight) }

  describe '#execute' do
    before { service.execute }

    it 'calls Flightstats::Status' do
      expect(Flightstats::Status).to have_received(:new).once
    end

    it 'calls Alerts::Remove with the rest of statuses' do
      expect(Alerts::Remove).to have_received(:new)
        .with(booking: booking, type: %w[flight_diverted flight_redirected flight_delayed])
    end

    it 'calls Alerts::Create with correct type' do
      expect(Alerts::Create).to have_received(:new).once
        .with(booking: booking, type: 'flight_cancelled')
    end

    it 'calls PushNotification service' do
      expect(Bookings::PushNotification).to have_received(:new)
        .with(
          booking:       booking,
          kind:          Bookings::PushNotification::FLIGHT_STATUS_CHANGE,
          flight_status: flight_status
        )
    end
  end
end
