require 'rails_helper'

RSpec.describe GoogleApi do
  let(:successed_service) { double(execute: double(success?: true, result: service_result)) }
  let(:failed_service)    { double(execute: double(success?: false)) }

  describe '#find_distance' do
    subject { described_class.find_distance('from', 'to') }

    before do
      allow(GoogleApi::FindDistance).to receive(:new)
        .with(origin: 'from', destination: 'to')
        .and_return(service)
    end

    context 'when service is success' do
      let(:service) { successed_service }
      let(:service_result) { { distance: 'dist' } }

      it { is_expected.to eq("distance" => 'dist') }
    end

    context 'when service is failed' do
      let(:service) { failed_service }

      it { is_expected.to eq("success" => false) }
    end
  end

  describe '#fetch_direction' do
    subject { described_class.fetch_direction(from: 'from', to: 'to', waypoints: 'waypoints') }

    before do
      allow(GoogleApi::Directions).to receive(:new)
        .with(origin: 'from', destination: 'to', waypoints: 'waypoints')
        .and_return(service)
    end

    context 'when service is success' do
      let(:service) { successed_service }
      let(:service_result) { { direction: 'dir' } }

      it { is_expected.to eq("direction" => 'dir') }
    end

    context 'when service is failed' do
      let(:service) { failed_service }

      it { is_expected.to eq("success" => false) }
    end
  end
end
