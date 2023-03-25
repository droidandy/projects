require 'rails_helper'

RSpec.describe Flightstats::Flights, type: :service do
  describe '#execute' do
    subject(:service) { described_class.new(params) }

    let(:params) { {flight: 'W95957', year: 2017, month: 4, day: 29} }

    context 'with invalid flight' do
      let(:params) { {flight: 'AAA', year: 2017, month: 4, day: 29} }

      it 'returns empty list of schedules' do
        expect(service.execute).not_to be_success
        expect(service.result).to be nil
      end
    end

    describe 'execution results' do
      let(:response_body) { Rails.root.join('spec/fixtures/flightstats/departing_schedule_response.json').read }

      before do
        stub_request(:get, 'https://api.flightstats.com/flex/schedules/rest/v1/json/flight/W9/5957/departing/2017/4/29')
          .to_return(status: 200, body: response_body)

        stub_request(:get, 'https://api.flightstats.com/flex/schedules/rest/v1/json/flight/W9/5957/arriving/2017/4/29')
          .to_return(status: 200, body: response_body)

        service.execute
      end

      after { Rails.cache.clear }

      it { is_expected.to be_success }

      describe 'result' do
        subject { service.result }

        context 'when flight schedule is present for specific date' do
          # scheduledFlights is present in response
          it { is_expected.to be_kind_of(Array) }

          describe 'each flight' do
            subject { service.result.first }

            its([:carrier]) { is_expected.to eq 'BA' }
            its([:flight])  { is_expected.to eq '5957' }
            its([:airline]) { is_expected.to eq 'British Airways' }
            its([:departure, :code])         { is_expected.to eq 'LHR' }
            its([:departure, :name])         { is_expected.to eq 'London Heathrow Airport' }
            its([:departure, :lat])          { is_expected.to be_present }
            its([:departure, :lng])          { is_expected.to be_present }
            its([:departure, :terminal])     { is_expected.to eq '2' }
            its([:departure, :line])         { is_expected.to eq 'London Heathrow Airport' }
            its([:departure, :country_code]) { is_expected.to eq 'GB' }
            its([:departure, :timezone])     { is_expected.to eq 'Europe/London' }
            its([:departure, :city])         { is_expected.to eq 'London' }
            its([:departure, :airport])      { is_expected.to eq 'LHR' }

            its([:arrival, :code])           { is_expected.to eq 'DUB' }
            its([:arrival, :name])           { is_expected.to eq 'Dublin Airport' }
            its([:arrival, :lat])            { is_expected.to be_present }
            its([:arrival, :lng])            { is_expected.to be_present }
            its([:arrival, :terminal])       { is_expected.to eq '2' }
          end
        end

        context 'when flight schedule is not present for specific date' do
          # scheduledFlights isn't present in response
          let(:response_body) { Rails.root.join('spec/fixtures/flightstats/empty_departing_schedule_response.json').read }

          it { is_expected.to be_nil }
        end
      end
    end
  end
end
