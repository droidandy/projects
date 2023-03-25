require 'rails_helper'

RSpec.describe Mobile::V1::PassengerAddresses::Create, type: :service do
  let(:service) { described_class.new(passenger: passenger, params: 'params') }

  describe '#execute' do
    let(:passenger)         { create(:passenger) }
    let(:airport)           { create(:airport, iata: 'iata') }
    let(:address)           { create(:address, airport: airport) }
    let(:passenger_address) { create(:passenger_address, passenger: passenger, address: address) }
    let(:address_service)   { double(result: passenger_address) }

    before do
      expect(::PassengerAddresses::Create).to receive(:new)
        .with(passenger: passenger, params: 'params').and_return(address_service)

      allow(address_service).to receive_message_chain(:execute, :success?).and_return(true)
      allow(address_service).to receive(:as_json)
        .and_return('name' => 'foo', 'address' => address.as_json)
    end

    it 'delegates to geocoding service and maps result' do
      expect(service.execute).to be_success
      expect(service.result).to match(
        'name'    => 'foo',
        'address' => hash_including(airport: 'iata')
      )
    end
  end
end
