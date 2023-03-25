require 'rails_helper'

RSpec.describe Gett::DriversList, type: :service do
  describe '#execute' do
    let(:company) { create(:company, address_id: create(:address).id) }
    let(:response) { {status: 200, body: File.read('./spec/fixtures/gett/drivers_response.json')} }

    describe '#when country_code is empty' do
      subject(:service) { described_class.new(lat: '', lng: '') }

      it 'uses default country code' do
        stub_request(:get, 'drivers_locations_url/gb/api?count=20&lat=&lon=&radius=1.5')
          .to_return(response)

        expect(service.execute).to be_success
      end
    end

    describe 'execution results' do
      subject(:service) { described_class.new(lat: '', lng: '', country_code: 'gb') }

      before do
        stub_request(:get, 'drivers_locations_url/gb/api?count=20&lat=&lon=&radius=1.5')
          .to_return(response)

        service.execute
      end

      it { is_expected.to be_success }

      describe 'result' do
        subject { service.result }

        its(:size) { is_expected.to eq(6) }

        it 'includes correct drivers' do
          is_expected.to eq([
            {
              id: "2896",
              status: "free",
              car_type: "BlackTaxi",
              locations: [
                { accuracy: 32, bearing: 292.1485, lat: 51.502875174713495, lng: -0.11726804902013852, speed: 1.3358233, ts: 1522674768000 },
                { accuracy: 32, bearing: 292.1485, lat: 51.50287367492515,  lng: -0.11726214560391603, speed: 1.5393177, ts: 1522674769000 },
                { accuracy: 32, bearing: 292.1485, lat: 51.50286819395849,  lng: -0.11724057160789422, speed: 1.5393177, ts: 1522674770000 },
                { accuracy: 32, bearing: 292.1485, lat: 51.502862048894784, lng: -0.1172163836155354,  speed: 1.6722823, ts: 1522674771000 },
                { accuracy: 32, bearing: 292.1485, lat: 51.50286286487981,  lng: -0.11721959546821233, speed: 2.1563716, ts: 1522674772000 }
              ]
            },
            {
              id: "14538",
              status: "free",
              car_type: "BlackTaxi",
              locations: [
                { accuracy: 2.4, bearing: 68.11, lat: 51.501088333333335, lng: -0.12534, speed: 0, ts: 1522674758405 }
              ]
            },
            {
              id: "7061",
              status: "free",
              car_type: "BlackTaxi",
              locations: [
                { accuracy: 10, bearing: 53.4375,   lat: 51.5016810643035,  lng: -0.11244817636917573, speed: 0.48, ts: 1522674766000 },
                { accuracy: 10, bearing: 330.8203,  lat: 51.5016810643035,  lng: -0.11244817636917573, speed: 0,    ts: 1522674767000 },
                { accuracy: 10, bearing: 39.018654, lat: 51.50168258552988, lng: -0.11244068135203195, speed: 0.39, ts: 1522674768000 },
                { accuracy: 10, bearing: 39.018654, lat: 51.50168184123528, lng: -0.1124416477107299,  speed: 0,    ts: 1522674769000 }
              ]
            },
            {
              id: "17694",
              status: "free",
              car_type: "BlackTaxi",
              locations: [
                { accuracy: 16, bearing: 351.3869, lat: 51.49870976778134,  lng: -0.11242273891578805, speed: 0, ts: 1522674767000 },
                { accuracy: 16, bearing: 351.3869, lat: 51.498707575693494, lng: -0.11242220693283969, speed: 0, ts: 1522674768000 },
                { accuracy: 16, bearing: 351.3869, lat: 51.498711560240714, lng: -0.1124231739155647,  speed: 0, ts: 1522674769000 },
                { accuracy: 16, bearing: 351.3869, lat: 51.49870989960677,  lng: -0.11242277090760525, speed: 0, ts: 1522674770000 },
                { accuracy: 16, bearing: 351.3869, lat: 51.498709773152946, lng: -0.11242274021937818, speed: 0, ts: 1522674771000 }
              ]
            },
            {
              id: "11591",
              status: "free",
              car_type: "BlackTaxi",
              locations: [
                { accuracy: 16, bearing: 332.70474, lat: 51.50564996836932,  lng: -0.11447485831082614, speed: 12.534712, ts: 1522674769000 },
                { accuracy: 16, bearing: 331.7402,  lat: 51.505768444175736, lng: -0.11457861044189106, speed: 12.423217, ts: 1522674770000 },
                { accuracy: 32, bearing: 331.74042, lat: 51.50590480501048,  lng: -0.11467399191550727, speed: 12.49095,  ts: 1522674771000 },
                { accuracy: 16, bearing: 332.11908, lat: 51.506018307706654, lng: -0.11475488947838407, speed: 12.49095,  ts: 1522674772000 }
              ]
            },
            {
              id: "15880",
              status: "free",
              car_type: "BlackTaxiXL",
              locations: [
                { accuracy: 16, bearing: 194.89537, lat: 51.50601302161403, lng: -0.1243580983942011,  speed: 0, ts: 1522674766000 },
                { accuracy: 16, bearing: 194.89537, lat: 51.50601255737511, lng: -0.12435829626852958, speed: 0, ts: 1522674767000 },
                { accuracy: 16, bearing: 194.89537, lat: 51.50601350597859, lng: -0.12435789194168913, speed: 0, ts: 1522674768000 },
                { accuracy: 16, bearing: 194.89537, lat: 51.50601282092598, lng: -0.12435818393422417, speed: 0, ts: 1522674769000 },
                { accuracy: 16, bearing: 194.89537, lat: 51.50601299979489, lng: -0.12435810769429602, speed: 0, ts: 1522674770000 }
              ]
            }
          ])
        end

        context 'when empty drivers' do
          let(:response) { {status: 200, body: {drivers: []}.to_json} }

          its(:size) { is_expected.to eq(0) }
        end

        context 'when empty response' do
          let(:response) { {status: 200, body: {}.to_json} }

          its(:size) { is_expected.to eq(0) }
        end
      end
    end
  end
end
