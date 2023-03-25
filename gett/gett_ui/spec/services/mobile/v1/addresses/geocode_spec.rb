require 'rails_helper'

RSpec.describe Mobile::V1::Addresses::Geocode, type: :service do
  let(:service) { described_class.new(lat: 1, lng: 2) }

  describe '#execute' do
    let(:geocoding_service) { double(result: {city: 'city', airport_iata: 'iata'}) }

    before do
      expect(::Addresses::Geocode).to receive(:new)
        .with(lat: 1, lng: 2).and_return(geocoding_service)

      allow(geocoding_service).to receive_message_chain(:execute, :success?).and_return(true)
    end

    it 'delegates to geocoding service and maps result' do
      expect(service.execute).to be_success
      expect(service.result).to eq(city: 'city', airport: 'iata')
    end
  end
end
