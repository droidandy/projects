require 'rails_helper'

RSpec.describe Flightstats::State, type: :service do
  describe '#execute' do
    subject(:service) { described_class.new(params) }

    let(:params) { {flight: 'AA987', year: 2018, month: 12, day: 21} }

    context 'with invalid flight' do
      let(:params) { {flight: 'AAA', year: 2017, month: 4, day: 29} }

      it 'returns empty list of schedules' do
        expect(service.execute).not_to be_success
        expect(service.result).to be nil
      end
    end

    describe 'execution results' do
      let(:response_body) { Rails.root.join('spec/fixtures/flightstats/state_flight.json').read }

      before do
        stub_request(:get, 'https://api.flightstats.com/flex/flightstatus/rest/v2/json/flight/status/AA/987/dep/2018/12/21')
          .to_return(status: 200, body: response_body)

        service.execute
      end

      after { Rails.cache.clear }

      it { is_expected.to be_success }

      describe 'result' do
        subject { service.result }

        context 'when flight schedule is present for specific date' do
          # flightStatuses is present in response
          it { is_expected.to be_kind_of(Array) }

          describe 'each flight' do
            subject { service.result.first }

            its([:carrier]) { is_expected.to eq 'AA' }
            its([:flight])  { is_expected.to eq '987' }
            its([:airline]) { is_expected.to eq 'American Airlines' }
            its([:departure, :code])           { is_expected.to eq 'MIA' }
            its([:departure, :name])           { is_expected.to eq 'Miami International Airport' }
            its([:departure, :scheduled_time]) { is_expected.to eq '2018-12-21T10:30:00.000' }
            its([:departure, :estimated_time]) { is_expected.to eq '2018-12-21T10:30:00.000' }
            its([:departure, :lat])            { is_expected.to be_present }
            its([:departure, :lng])            { is_expected.to be_present }
            its([:departure, :terminal])       { is_expected.to eq 'C' }
            its([:departure, :gate])           { is_expected.to eq 'E6' }
            its([:departure, :line])           { is_expected.to eq 'Miami International Airport' }
            its([:departure, :country_code])   { is_expected.to eq 'US' }
            its([:departure, :timezone])       { is_expected.to eq 'America/New_York' }
            its([:departure, :city])           { is_expected.to eq 'Miami' }
            its([:departure, :airport])        { is_expected.to eq 'MIA' }

            its([:arrival, :code])             { is_expected.to eq 'SDQ' }
            its([:arrival, :name])             { is_expected.to eq 'Las Americas International Airport' }
            its([:arrival, :lat])              { is_expected.to be_present }
            its([:arrival, :lng])              { is_expected.to be_present }
            its([:arrival, :terminal])         { is_expected.to eq nil }
          end
        end

        context 'when flight schedule is not present for specific date' do
          # flightStatuses isn't present in response
          let(:response_body) { Rails.root.join('spec/fixtures/flightstats/error_state_flight.json').read }

          it { is_expected.to be_nil }
        end
      end
    end
  end
end
