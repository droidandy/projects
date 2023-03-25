require 'rails_helper'

RSpec.describe Bookings::FlightInfo, type: :service do
  describe '#execute' do
    let(:pickup_iata)      { nil }
    let(:destination_iata) { nil }
    let(:service) do
      described_class.new(
        flight:           'BA5957',
        scheduled_at:     Date.new(2017, 4, 29),
        pickup_iata:      pickup_iata,
        destination_iata: destination_iata
      )
    end

    subject(:result) { service.execute.result }

    before do
      stub_request(:get, 'https://api.flightstats.com/flex/schedules/rest/v1/json/flight/BA/5957/departing/2017/4/29')
        .to_return(status: 200, body: Rails.root.join('spec/fixtures/flightstats/departing_schedule_response.json').read)
    end

    context 'when pickup_iata is specified' do
      let(:pickup_iata) { 'DUB' }

      it 'contains information on flight that arrives at pickup iata airport' do
        expect(result).to match(
          'DUB' => hash_including(:carrier, :flight, :code, :name, :time, :terminal, :lat, :lng)
        )
      end
    end

    context 'when destination_iata is specified' do
      let(:destination_iata) { 'LHR' }

      it 'contains information on flight that departs from destination iata airport' do
        expect(result).to match(
          'LHR' => hash_including(:carrier, :flight, :code, :name, :time, :terminal, :lat, :lng)
        )
      end
    end
  end
end
