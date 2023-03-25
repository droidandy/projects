require 'rails_helper'

RSpec.describe Drivers::Locations, type: :service do
  describe '#execute' do
    subject(:service) { described_class.new(params: location) }

    before do
      service_stub = double(execute: double(success?: true, result: 'list'))
      allow(Gett::DriversList).to receive(:new).and_return(service_stub)
    end

    context 'with correct location' do
      let(:location) { { lat: '52.23', lng: '0.12' } }

      it do
        expect(Gett::DriversList).to receive(:new).with(lat: '52.23', lng: '0.12')

        expect(service.execute).to be_success
      end
    end
  end
end
