require 'rails_helper'

RSpec.describe Mobile::V1::UserLocations::Create, type: :service do
  let(:passenger) { create(:passenger) }

  describe '#execute' do
    context 'coordinates present' do
      subject(:service) do
        described_class.new(user: passenger, point: { lat: 1, lng: 1 })
      end

      it 'executes successfully' do
        service.execute
        expect(service).to be_success
      end
    end

    context 'coordinates missing' do
      subject(:service) do
        described_class.new(user: passenger, point: { lat: nil, lng: nil })
      end

      it 'fails execution' do
        service.execute
        expect(service).to_not be_success
      end
    end
  end
end
