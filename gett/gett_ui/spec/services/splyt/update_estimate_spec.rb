require 'rails_helper'

RSpec.describe Splyt::UpdateEstimate do
  subject(:service) { described_class.new(booking: booking) }

  describe '#execute' do
    let(:booking) { create(:booking, :splyt, :without_passenger, :future, scheduled_at: scheduled_at) }
    let(:scheduled_at)                 { DateTime.parse('25.09.3018 12:00') }
    let(:estimate_fetcher)             { double(:estimate_fetcher) }
    let(:estimate_fetcher_with_result) { double(:estimate_fetcher_with_result, normalized_response: estimate) }
    let(:estimate)                     { { estimate_id: '123' } }
    let(:estimate_params) do
      {
        provider_id:     booking.quote_id,
        region_id:       booking.region_id,
        car_type:        booking.vehicle.value,
        booking_type:    'future',
        pickup_address:  booking.pickup_address.to_h.slice(:lat, :lng),
        dropoff_address: booking.destination_address.to_h.slice(:lat, :lng),
        departure_date:  scheduled_at
      }
    end

    before do
      allow(Splyt::Estimate).to  receive(:new).with(estimate_params).and_return(estimate_fetcher)
      allow(estimate_fetcher).to receive(:execute).and_return(estimate_fetcher_with_result)
    end

    it 'fetches estimate' do
      expect(Splyt::Estimate).to  receive(:new).with(estimate_params).and_return(estimate_fetcher)
      expect(estimate_fetcher).to receive(:execute).and_return(estimate_fetcher_with_result)

      service.execute
    end

    context 'when there is an estimate' do
      it 'updates booking estimate_id' do
        service.execute

        expect(booking.reload.estimate_id).to eq(estimate[:estimate_id])
      end
    end

    context 'when there is no estimate' do
      let(:estimate) { {} }

      it 'raises an error' do
        expect { service.execute }.to raise_error(KeyError, 'key not found: :estimate_id')
      end
    end
  end
end
