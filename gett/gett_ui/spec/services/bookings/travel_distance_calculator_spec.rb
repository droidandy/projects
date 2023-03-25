require 'rails_helper'

describe Bookings::TravelDistanceCalculator do
  let(:booking) { create(:booking) }

  let(:distance_service_stub) do
    double(execute: double(success?: true, result: { success?: true, distance: 200.0, duration: 60, distance_measure: distance_measure }))
  end

  let(:distance_measure) { 'miles' }

  before do
    booking.add_booking_address(
      address_id: create(:address).id,
      address_type: 'stop',
      stop_info: { name: 'Bob', phone: '+79998887766' }
    )

    allow(GoogleApi::FindDistance).to receive(:new).and_return(distance_service_stub)
  end

  subject(:service) { Bookings::TravelDistanceCalculator.new(booking: booking) }

  context 'when distance_measure is miles' do
    it 'calculates distance between path addresses in miles' do
      expect(service.execute.result[:distance]).to eq 400.0
    end
  end

  context 'when distance_measure is feet' do
    let(:distance_measure) { 'feet' }
    it 'calculates distance between path addresses in miles' do
      expect(service.execute.result[:distance]).to eq 0.08
    end
  end

  context 'for affiliate booking without destination' do
    it 'returns nil' do
      booking.destination_address = nil
      expect(service.execute.result).to be nil
    end
  end
end
