require 'rails_helper'

RSpec.describe GetE::Vehicles, type: :service do
  subject(:service) { described_class.new(attrs: params, allowed_services: [:get_e]) }

  service_context { { company: create(:company) } }

  let(:params) do
    {
      scheduled_at: DateTime.parse('2017-11-17T14:00:00'),
      pickup_address: {
        lat: 51.6,
        lng: -0.43,
        line: 'Address line',
        place_id: 'ChIJ9X2GwQE-zRIRMqiTuJO0rbQ'
      },
      destination_address: {
        lat: 51.5,
        lng: -0.22,
        line: 'Address line',
        place_id: 'ChIJ9X2GwQE-zRIRMqiTuJO0rbQ'
      }
    }
  end

  describe '#execute' do
    context 'when succeeds' do
      let(:quotes_response) { Rails.root.join('spec/fixtures/get_e/vehicles_response.json').read }

      let(:response) { double(body: quotes_response, code: 200) }
      let(:vehicles_response) do
        double(execute: true, success?: true, response: response)
      end

      let(:vehicles) do
        [
          {
            value: 'Taxi Sedan',
            name: 'Standard',
            quote_id: 'quote1',
            price: 11100.00,
            supports_driver_message: true,
            supports_flight_number: true
          },
          {
            value: 'Comfort Sedan',
            name: 'Standard',
            quote_id: 'quote2',
            price: 22200.00,
            supports_driver_message: true,
            supports_flight_number: true
          },
          {
            value: 'Executive Sedan',
            name: 'Exec',
            quote_id: 'quote3',
            price: 33300.00,
            supports_driver_message: true,
            supports_flight_number: true
          },
          {
            value: 'Business Sedan',
            name: 'Exec',
            quote_id: 'quote4',
            price: 44400.00,
            supports_driver_message: true,
            supports_flight_number: true
          },
          {
            value: 'Taxi Van',
            name: 'MPV',
            quote_id: 'quote5',
            price: 55500.00,
            supports_driver_message: true,
            supports_flight_number: true
          },
          {
            value: 'Comfort Van',
            name: 'MPV',
            quote_id: 'quote6',
            price: 66600.00,
            supports_driver_message: true,
            supports_flight_number: true
          }
        ]
      end
      before do
        expect(service).to receive(:params).and_return('params')
        allow(response).to receive(:with_context).and_return(response)
        expect(RestClient).to receive(:post)
          .with('https://localhost/quotes', 'params', authorization: 'X-Api-Key TestKey')
          .and_return(response)
        service.execute
      end

      it { is_expected.to be_success }
      its('as_vehicles') { is_expected.to match_array(vehicles) }
    end

    specify '#params' do
      expect(service.send(:params)).to match(
        Pickup: {
          Place: { Id: 'ChIJ9X2GwQE-zRIRMqiTuJO0rbQ' },
          Address: { AddressLine: 'Address line' },
          Airport: { },
          Location: {
            Latitude: 51.6,
            Longitude: -0.43
          },
          PickupTime: '2017-11-17T14:00:00'
        },
        DropOff: {
          Place: { Id: 'ChIJ9X2GwQE-zRIRMqiTuJO0rbQ' },
          Address: { AddressLine: 'Address line' },
          Airport: { },
          Location: {
            Latitude: 51.5,
            Longitude: -0.22
          }
        }
      )
    end
  end

  describe '#can_execute?' do
    context 'when cannot execute' do
      its(:can_execute?) { is_expected.to be true }

      context 'when allowed_services does not include carey' do
        subject(:service) { described_class.new(attrs: params, allowed_services: []) }
        its(:can_execute?) { is_expected.to be false }
      end
    end
  end
end
