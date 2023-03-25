require 'rails_helper'

RSpec.describe Flightstats::Schedule, type: :service do
  describe '#execute' do
    subject(:service) { described_class.new(params) }

    let(:params) { { flight: 'W95957', year: 2017, month: 4, day: 29 } }

    before do
      stub_request(:get, %r(https://api.flightstats.com/flex/schedules/rest/v1/json/flight/W9/5957/departing/2017/\d/\d{1,2}))
        .to_return(status: 200, body: Rails.root.join('spec/fixtures/flightstats/departing_schedule_response.json').read)

      stub_request(:get, %r(https://api.flightstats.com/flex/schedules/rest/v1/json/flight/W9/5957/arriving/2017/\d/\d{1,2}))
        .to_return(status: 200, body: Rails.root.join('spec/fixtures/flightstats/arriving_schedule_response.json').read)
      # FYI: this is some kind of preload to prevent a circular dependency while using threads without enabling of eager load
      ::Flightstats::Requests::FlightSchedule # rubocop:disable Lint/Void
      ::ApplicationService::HttpCallbacks
    end

    it 'initialises seven Flightstats::Flights instances' do
      expect(Flightstats::Flights).to receive(:new)
        .with(flight: 'W95957', year: 2017, month: 4, day: 28).ordered.and_call_original

      expect(Flightstats::Flights).to receive(:new)
        .with(flight: 'W95957', year: 2017, month: 4, day: 29).ordered.and_call_original

      expect(Flightstats::Flights).to receive(:new)
        .with(flight: 'W95957', year: 2017, month: 4, day: 30).ordered.and_call_original

      expect(Flightstats::Flights).to receive(:new)
        .with(flight: 'W95957', year: 2017, month: 5, day: 1).ordered.and_call_original

      expect(Flightstats::Flights).to receive(:new)
        .with(flight: 'W95957', year: 2017, month: 5, day: 2).ordered.and_call_original

      expect(Flightstats::Flights).to receive(:new)
        .with(flight: 'W95957', year: 2017, month: 5, day: 3).ordered.and_call_original

      expect(Flightstats::Flights).to receive(:new)
        .with(flight: 'W95957', year: 2017, month: 5, day: 4).ordered.and_call_original

      service.execute
    end

    it 'executes work in parallel' do
      expect(Thread).to receive(:new).exactly(7).times.and_return([])
      service.execute
    end

    describe 'execution results' do
      let(:april_departing_response) { Rails.root.join('spec/fixtures/flightstats/departing_schedule_response.json').read }
      let(:april_arriving_response)  { Rails.root.join('spec/fixtures/flightstats/arriving_schedule_response.json').read }

      before do
        Rails.cache.clear

        stub_request(:get, %r(https://api.flightstats.com/flex/schedules/rest/v1/json/flight/W9/5957/departing/2017/4/\d{2}))
          .to_return(status: 200, body: april_departing_response)

        stub_request(:get, %r(https://api.flightstats.com/flex/schedules/rest/v1/json/flight/W9/5957/arriving/2017/4/\d{2}))
          .to_return(status: 200, body: april_arriving_response)

        stub_request(:get, %r(https://api.flightstats.com/flex/schedules/rest/v1/json/flight/W9/5957/departing/2017/5/\d))
          .to_return(status: 200, body: Rails.root.join('spec/fixtures/flightstats/empty_departing_schedule_response.json').read)

        stub_request(:get, %r(https://api.flightstats.com/flex/schedules/rest/v1/json/flight/W9/5957/arriving/2017/5/\d))
          .to_return(status: 200, body: Rails.root.join('spec/fixtures/flightstats/empty_arriving_schedule_response.json').read)

        service.execute
      end

      it { is_expected.to be_success }
      its('result.size') { is_expected.to eq(3) } # successful april results

      context 'when flightstats failed to find any result' do
        let(:april_departing_response) { Rails.root.join('spec/fixtures/flightstats/empty_departing_schedule_response.json').read }
        let(:april_arriving_response) { Rails.root.join('spec/fixtures/flightstats/empty_arriving_schedule_response.json').read }

        specify { expect(service).not_to be_success }
      end
    end
  end
end
