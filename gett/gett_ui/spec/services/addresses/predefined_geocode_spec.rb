require 'rails_helper'

RSpec.describe Addresses::PredefinedGeocode, type: :service do
  subject(:service) { described_class.new(line: address_line) }

  let(:address_line) { 'London Heathrow Airport Terminal 11' }

  let!(:airport) { create(:airport, lat: 51.472529, lng: -0.450487) }
  let!(:address) { create(:predefined_address, line: address_line, lat: 51.472529, lng: -0.450487, airport: airport) }

  describe '#execute!' do
    subject(:result) { service.execute.result }

    context 'when predefined address is airport' do
      its([:airport_iata]) { is_expected.to eq(airport.iata) }
    end

    context 'when predefined address is not airport' do
      let(:address_line) { '2, Hyde Park Place, London, W2 2LH' }
      let(:address) { create(:predefined_address, line: address_line) }

      its([:airport_iata]) { is_expected.to be_nil }
    end
  end
end
