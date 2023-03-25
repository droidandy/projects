require 'rails_helper'

RSpec.describe Flightstats::Status, type: :service do
  describe '#execute' do
    subject(:service) { described_class.new(params) }

    let(:params) { {flight: 'W95957', year: 2017, month: 4, day: 29} }

    describe 'execution results' do
      let(:response_code) { 200 }

      before do
        stub_request(:get, 'https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/W9/5957/arr/2017/4/29')
          .to_return(status: response_code, body: Rails.root.join("spec/fixtures/flightstats/status_responses/#{status}.json").read)
        stub_request(:get, 'https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/W9/5957/dep/2017/4/29')
          .to_return(status: response_code, body: Rails.root.join("spec/fixtures/flightstats/status_responses/#{status}.json").read)

        service.execute
      end

      describe 'results' do
        subject { service.execute.result }

        context 'when flight is active' do
          let(:status) { 'active' }

          its([:status]) { is_expected.to eq('flight_active') }
        end

        context 'when flight is scheduled' do
          let(:status) { 'scheduled' }

          its([:status]) { is_expected.to eq('flight_scheduled') }
        end

        context 'when flight is delayed' do
          let(:status) { 'delayed' }

          its([:status]) { is_expected.to eq('flight_delayed') }
        end

        context 'when flight is redirected' do
          let(:status) { 'redirected' }

          its([:status]) { is_expected.to eq('flight_redirected') }
        end

        context 'when flight is diverted' do
          let(:status) { 'diverted' }

          its([:status]) { is_expected.to eq('flight_diverted') }
        end

        context 'when flight is cancelled' do
          let(:status) { 'cancelled' }

          its([:status]) { is_expected.to eq('flight_cancelled') }
        end

        context 'when flight is landed' do
          let(:status) { 'landed' }

          its([:status]) { is_expected.to eq('flight_landed') }
        end
      end

      context 'when API response is unsuccessfull service execution should fail' do
        let(:status) { 'cancelled' }
        let(:response_code) { 404 }

        it { is_expected.not_to be_success }
      end
    end

    describe 'when arrival flight status is blank' do
      let(:response_code) { 200 }

      before do
        stub_request(:get, 'https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/W9/5957/arr/2017/4/29')
          .to_return(status: 200, body: Rails.root.join("spec/fixtures/flightstats/status_responses/empty.json").read)

        stub_request(:get, 'https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/W9/5957/dep/2017/4/29')
          .to_return(status: 200, body: Rails.root.join("spec/fixtures/flightstats/status_responses/#{status}.json").read)

        service.execute
      end

      describe 'departure status is called' do
        subject { service.execute.result }

        context 'when flight is active' do
          let(:status) { 'active' }

          its([:status]) { is_expected.to eq('flight_active') }
        end

        context 'when flight is scheduled' do
          let(:status) { 'scheduled' }

          its([:status]) { is_expected.to eq('flight_scheduled') }
        end

        context 'when flight is delayed' do
          let(:status) { 'delayed' }

          its([:status]) { is_expected.to eq('flight_delayed') }
        end

        context 'when flight is redirected' do
          let(:status) { 'redirected' }

          its([:status]) { is_expected.to eq('flight_redirected') }
        end

        context 'when flight is diverted' do
          let(:status) { 'diverted' }

          its([:status]) { is_expected.to eq('flight_diverted') }
        end

        context 'when flight is cancelled' do
          let(:status) { 'cancelled' }

          its([:status]) { is_expected.to eq('flight_cancelled') }
        end

        context 'when flight is landed' do
          let(:status) { 'landed' }

          its([:status]) { is_expected.to eq('flight_landed') }
        end
      end
    end
  end
end
