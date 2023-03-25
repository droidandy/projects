require 'rails_helper'

RSpec.describe TravelRules::VehicleAvailability::LocationServicesSelector, type: :service do
  subject(:service) { TravelRules::VehicleAvailability::LocationServicesSelector.new(location: location) }

  describe '#execute!' do
    let(:location) { {country_code: country_code, city: city, region: region} }

    let(:gb_apis) { %i[gett ot manual].freeze }
    let(:il_apis) { [:gett, :splyt].freeze }
    let(:ru_apis) { [:gett].freeze }
    let(:international_apis) { %i[get_e manual carey splyt].freeze }
    let(:region) { 'some region' }

    subject { service.execute }

    context 'when county is GB' do
      let(:country_code) { 'GB' }
      let(:city) { 'London' }

      its(:result) { is_expected.to eq(gb_apis) }
    end

    context 'when county is not GB' do
      let(:country_code) { 'US' }
      let(:city) { 'New York' }

      its(:result) { is_expected.to eq(international_apis) }
    end

    context 'when county is IL' do
      let(:country_code) { 'IL' }
      let(:city) { 'Tel Aviv' }

      its(:result) { is_expected.to eq(il_apis) }
    end

    context 'when county is RU' do
      let(:country_code) { 'RU' }

      cities = [
        'Adler',
        'Bolshoy Sochi',
        'Kazan',
        'Nizhnij Novgorod',
        'Rostov',
        'Samara',
        'Sankt-Peterburg',
        'Saransk',
        'Sochi',
        'Volgograd',
        'Yekaterinburg',
        'Moskva',
        'Vnukovo',       # Vnukovo airport
        'Ryazanovo',     # Ostaf'yevo airport
        'Shchyolkovo',   # Chkalovskiy airport
        'Khimki',        # Sheremet'evo airport
        'Moscow Oblast', # Domodeovo airport (DME)
        'Domodedovo',    # Domodedovo terminal
        'Zhukovskiy'     # Zhukovskiy airport
      ]

      regions = [
        'Moscow',
        'Saint Petersburg'
      ]

      cities.each do |city|
        context "when city is #{city}" do
          let(:city) { city }

          its(:result) { is_expected.to eq(ru_apis) }
        end
      end

      regions.each do |region|
        context "when region is #{region}" do
          let(:city) { 'some city' }
          let(:region) { region }

          its(:result) { is_expected.to eq(ru_apis) }
        end
      end

      context 'when city is not Moscow or related airport' do
        let(:city) { 'Omsk' }

        its(:result) { is_expected.to eq(international_apis) }
      end
    end
  end
end
