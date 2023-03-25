require 'rails_helper'

RSpec.describe Flightstats::Base, type: :service do
  subject(:service) { Flightstats::Base.new(params) }

  describe '#flight_data' do
    subject { service.send(:flight_data)&.named_captures&.values }

    context 'when flight has two chars carrier' do
      let(:params) { { flight: 'BA35445' } }
      it { is_expected.to eq(['BA', '35445']) }
    end

    context 'when flight has one char carrier' do
      let(:params) { { flight: '2B35445' } }
      it { is_expected.to eq(['2B', '35445']) }
    end

    context 'when flight has three chars carrier' do
      let(:params) { { flight: 'SDB35445' } }
      it { is_expected.to eq(['SDB', '35445']) }
    end

    context 'when flight carrier is numbers only' do
      let(:params) { { flight: '12335445' } }
      it { is_expected.to eq(['12', '335445']) }
    end

    context 'when flight is totally invalid' do
      let(:params) { { flight: 'foobar' } }
      it { is_expected.to be nil }
    end

    context 'when flight nubmer has leading zeros' do
      let(:params) { { flight: 'BA002' } }
      it { is_expected.to eq(['BA', '2']) }
    end

    context 'when flight carrier has leading zeros' do
      let(:params) { { flight: '0BA002' } }
      it { is_expected.to eq(['BA', '2']) }
    end
  end

  describe 'FlightValidation module' do
    # FlightValidation module will be prepended for each Flightstats::Base inheritance
    subject { service_class.new(params).execute }

    let(:service_class) do
      Class.new(Flightstats::Base) do
        private def execute!
          'hello, world!'
        end
      end
    end

    context 'when flight present' do
      let(:params) { { flight: 'BA35445' } }
      its(:result) { is_expected.to be_present }
    end

    context 'when flight is not present' do
      let(:params) { { flight: nil } }
      its(:result) { is_expected.to be_nil }
    end
  end
end
