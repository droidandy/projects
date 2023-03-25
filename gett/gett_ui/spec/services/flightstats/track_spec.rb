require 'rails_helper'

RSpec.describe Flightstats::Track, type: :service do
  describe '#execute' do
    subject(:service) { described_class.new(params) }

    let(:params) { {flight_id: 986682279} }

    context 'with invalid flight' do
      let(:params) { {flight_id: '986$6822778414s'} }

      it 'returns empty' do
        expect(service.execute).not_to be_success
        expect(service.result).to be nil
      end
    end

    describe 'execution results' do
      let(:response_body) { Rails.root.join('spec/fixtures/flightstats/flight_track.json').read }

      before do
        stub_request(:get, 'https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/track/986682279?maxPositions=1')
          .to_return(status: 200, body: response_body)

        service.execute
      end

      after { Rails.cache.clear }

      it { is_expected.to be_success }

      describe 'result flight moving' do
        subject { service.result }

        context 'when unable to find a flight with the ID given' do
          # positions is present in response

          its([:lon])  { is_expected.to eq 10.1389 }
          its([:lat])  { is_expected.to eq 43.2731 }
          its([:date]) { is_expected.to eq '2019-01-15T21:03:37.000Z' }
        end

        context 'when unable to find a flight with the ID given' do
          # positions isn't present in response
          let(:response_body) { Rails.root.join('spec/fixtures/flightstats/error_flight_tracking_response.json').read }

          it { is_expected.to be_nil }
        end
      end
    end
  end
end
