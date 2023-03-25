RSpec.describe Flightstats::Schedule do
  describe '#execute' do
    subject(:service) { Flightstats::Schedule.new(params: params) }

    let(:params) do
      { flight: 'W95957',
        year:   2017,
        month:  4,
        day:    29
      }
    end

    describe 'service params' do
      let(:response) do
        double(:response, body: File.read('./spec/fixtures/flightstats/schedule_response.json'), code: 200)
      end

      it 'calls correct url' do
        expect(RestClient).to receive(:get).with(
          'https://api.flightstats.com/flex/schedules/rest/v1/json/flight/W9/5957/departing/2017/4/29',
          { 'appId' => 'id', 'appKey' => 'secret' }
        ).and_return(response)

        service.execute
      end

      describe 'execution results' do
        before do
          allow(RestClient).to receive(:get).and_return(response)
          service.execute
        end

        it { is_expected.to be_success }

        describe 'result' do
          subject { service.result }

          its([:carrier]) { is_expected.to eq 'BA' }
          its([:flight])  { is_expected.to eq '5957' }
          its([:departure, :code])     { is_expected.to eq 'LHR' }
          its([:departure, :name])     { is_expected.to eq 'London Heathrow Airport' }
          its([:departure, :lat])      { is_expected.to be_present }
          its([:departure, :lng])      { is_expected.to be_present }
          its([:departure, :terminal]) { is_expected.to eq '2' }

          its([:arrival, :code])     { is_expected.to eq 'DUB' }
          its([:arrival, :name])     { is_expected.to eq 'Dublin Airport' }
          its([:arrival, :lat])      { is_expected.to be_present }
          its([:arrival, :lng])      { is_expected.to be_present }
          its([:arrival, :terminal]) { is_expected.to eq '2' }
        end
      end
    end
  end
end
