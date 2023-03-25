require 'rails_helper'

RSpec.describe Splyt::Vehicles do
  subject(:service) { described_class.new(attrs: attrs, allowed_services: allowed_services) }

  let(:attrs) do
    {
      pickup_address:      pickup_address,
      destination_address: dropoff_address,
      scheduled_type:      'now'
    }
  end

  let(:allowed_services) { [:splyt] }
  let(:pickup_address)   { { lat: 1, lng: 1 } }
  let(:dropoff_address)  { { lat: 2, lng: 2 } }

  let(:providers) do
    {
      providers: [
        {
          supplier: 'Splyt: Sup1',
          provider_id: '1',
          region_id: '1',
          car_types: [
            'standard',
            'exec'
          ],
          supports_driver_message: true,
          supports_flight_number:  true
        },
        {
          supplier: 'Splyt: Sup2',
          provider_id: '2',
          region_id: '1',
          car_types: [
            'standard'
          ],
          supports_driver_message: true,
          supports_flight_number:  true
        },
        {
          supplier: 'Splyt: Sup3',
          provider_id: '3',
          region_id: '1',
          car_types: [
            'exec', 'baby'
          ],
          supports_driver_message: true,
          supports_flight_number:  true
        }
      ]
    }
  end

  let(:filtered_vehicles) do
    [
      {
        supplier:                'Splyt: Sup2',
        provider_id:             '2',
        car_type:                'standard',
        eta:                     1,
        lower_price:             999,
        supports_driver_message: true,
        supports_flight_number:  true,
        estimate_id:             '3',
        region_id:               '1'
      },
      {
        supplier:                'Splyt: Sup1',
        provider_id:             '1',
        car_type:                'exec',
        eta:                     1,
        lower_price:             99,
        supports_driver_message: true,
        supports_flight_number:  true,
        estimate_id:             '2',
        region_id:               '1'
      },
      {
        supplier:                'Splyt: Sup3',
        provider_id:             '3',
        car_type:                'baby',
        eta:                     3,
        lower_price:             1000,
        supports_driver_message: true,
        supports_flight_number:  true,
        estimate_id:             '5',
        region_id:               '1'
      }
    ]
  end

  let(:providers_service)               { double(:providers_service, execute: providers_service_with_response) }
  let(:providers_service_with_response) { double(:providers_service, normalized_response: providers) }

  let(:estimate_service1)               { double(:estimate_service, execute: estimate_service_with_response1) }
  let(:estimate_service_with_response1) { double(:estimate_service, normalized_response: estimate1) }
  let(:estimate1)                       { { estimate_id: '1', eta: 2, lower_price: 100 } }

  let(:estimate_service2)               { double(:estimate_service, execute: estimate_service_with_response2) }
  let(:estimate_service_with_response2) { double(:estimate_service, normalized_response: estimate2) }
  let(:estimate2)                       { { estimate_id: '2', eta: 1, lower_price: 99 } }

  let(:estimate_service3)               { double(:estimate_service, execute: estimate_service_with_response3) }
  let(:estimate_service_with_response3) { double(:estimate_service, normalized_response: estimate3) }
  let(:estimate3)                       { { estimate_id: '3', eta: 1, lower_price: 999 } }

  let(:estimate_service4)               { double(:estimate_service, execute: estimate_service_with_response4) }
  let(:estimate_service_with_response4) { double(:estimate_service, normalized_response: estimate4) }
  let(:estimate4)                       { { estimate_id: '4', eta: 1, lower_price: 100 } }

  let(:estimate_service5)               { double(:estimate_service, execute: estimate_service_with_response5) }
  let(:estimate_service_with_response5) { double(:estimate_service, normalized_response: estimate5) }
  let(:estimate5)                       { { estimate_id: '5', eta: 3, lower_price: 1000 } }

  let(:estimate_params1) do
    {
      provider_id:     '1',
      region_id:       '1',
      car_type:        'standard',
      booking_type:    'now',
      pickup_address:  pickup_address,
      dropoff_address: dropoff_address
    }
  end

  let(:estimate_params2) do
    {
      provider_id:     '1',
      region_id:       '1',
      car_type:        'exec',
      booking_type:    'now',
      pickup_address:  pickup_address,
      dropoff_address: dropoff_address
    }
  end

  let(:estimate_params3) do
    {
      provider_id:     '2',
      region_id:       '1',
      car_type:        'standard',
      booking_type:    'now',
      pickup_address:  pickup_address,
      dropoff_address: dropoff_address
    }
  end

  let(:estimate_params4) do
    {
      provider_id:     '3',
      region_id:       '1',
      car_type:        'exec',
      booking_type:    'now',
      pickup_address:  pickup_address,
      dropoff_address: dropoff_address
    }
  end

  let(:estimate_params5) do
    {
      provider_id:     '3',
      region_id:       '1',
      car_type:        'baby',
      booking_type:    'now',
      pickup_address:  pickup_address,
      dropoff_address: dropoff_address
    }
  end

  before do
    allow(Splyt::Providers).to receive(:new).and_return(providers_service)

    allow(Splyt::Estimate).to receive(:new).with(estimate_params1).and_return(estimate_service1)
    allow(Splyt::Estimate).to receive(:new).with(estimate_params2).and_return(estimate_service2)
    allow(Splyt::Estimate).to receive(:new).with(estimate_params3).and_return(estimate_service3)
    allow(Splyt::Estimate).to receive(:new).with(estimate_params4).and_return(estimate_service4)
    allow(Splyt::Estimate).to receive(:new).with(estimate_params5).and_return(estimate_service5)
  end

  describe '#can_execute?' do
    context 'when the Splyt provider is allowed' do
      it 'returns true' do
        expect(service.can_execute?).to eq(true)
      end
    end

    context 'when the Splyt provider is not allowd' do
      let(:allowed_services) { [] }

      it 'returns false' do
        expect(service.can_execute?).to eq(false)
      end
    end
  end

  describe '#execute' do
    it 'fetches providers' do
      expect(providers_service_with_response).to receive(:normalized_response).and_return(providers)

      service.execute
    end

    it 'fetches estimates' do
      expect(estimate_service_with_response1).to receive(:normalized_response).and_return(estimate1)
      expect(estimate_service_with_response2).to receive(:normalized_response).and_return(estimate2)
      expect(estimate_service_with_response3).to receive(:normalized_response).and_return(estimate3)
      expect(estimate_service_with_response4).to receive(:normalized_response).and_return(estimate4)
      expect(estimate_service_with_response5).to receive(:normalized_response).and_return(estimate5)

      service.execute
    end

    it 'filters vehicles(sort by eta/price and select uniq by car_type)' do
      service.execute

      expect(service.result).to match_array(filtered_vehicles)
    end
  end

  describe '#as_vehicles' do
    context 'when the previous fetch call is not successful' do
      before { allow(service).to receive(:success?).and_return(false) }

      it 'returns empty array' do
        expect(service.as_vehicles).to eq([])
      end
    end

    context 'when the previous fetch call is successful' do
      let(:vehicles) do
        [
          {
            supplier:                'Splyt: Sup2',
            name:                    'Standard',
            value:                   'standard',
            price:                   999,
            eta:                     1,
            quote_id:                '2',
            supports_driver_message: true,
            supports_flight_number:  true,
            estimate_id:             '3',
            region_id:               '1'
          },
          {
            supplier:                'Splyt: Sup1',
            name:                    'Exec',
            value:                   'exec',
            price:                   99,
            eta:                     1,
            quote_id:                '1',
            supports_driver_message: true,
            supports_flight_number:  true,
            estimate_id:             '2',
            region_id:               '1'
          },
          {
            supplier:                'Splyt: Sup3',
            name:                    'BabySeat',
            value:                   'baby',
            price:                   1000,
            eta:                     3,
            quote_id:                '3',
            supports_driver_message: true,
            supports_flight_number:  true,
            estimate_id:             '5',
            region_id:               '1'
          }
        ]
      end

      it 'maps providers to vehicles' do
        service.execute

        expect(service.as_vehicles).to match_array(vehicles)
      end
    end

    context 'when there is vehicle without estimate_id' do
      let(:estimate5) { {} }
      let(:vehicles) do
        [
          {
            supplier:                'Splyt: Sup2',
            name:                    'Standard',
            value:                   'standard',
            price:                   999,
            eta:                     1,
            quote_id:                '2',
            supports_driver_message: true,
            supports_flight_number:  true,
            estimate_id:             '3',
            region_id:               '1'
          },
          {
            supplier:                'Splyt: Sup1',
            name:                    'Exec',
            value:                   'exec',
            price:                   99,
            eta:                     1,
            quote_id:                '1',
            supports_driver_message: true,
            supports_flight_number:  true,
            estimate_id:             '2',
            region_id:               '1'
          }
        ]
      end

      it 'ignores vehicle without estimate' do
        service.execute

        expect(service.as_vehicles).to match_array(vehicles)
      end
    end
  end
end
