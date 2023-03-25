require 'rails_helper'

RSpec.describe Splyt::Providers do
  subject(:service) { described_class.new(pickup_address: pickup_address, booking_type: booking_type) }

  let(:pickup_address)  { { lat: 2, lng: 2 } }
  let(:url_with_params) { "#{api_url}/v2/providers/#{booking_type}?latitude=2&longitude=2" }
  let(:api_url)         { Settings.splyt.api_url }
  let(:booking_type)    { 'now' }

  let(:response) do
    {
      providers: [
        {
          provider: {
            provider_id: '5afae79139e051a014b06b0b',
            self_link: '/v1/providers/5afae79139e051a014b06b0b',
            display_name: 'Careem',
            logo: 'https://image.splytech.io/partner-logos/careem.png',
            flags: {
              supports_flight_number: false,
              supports_driver_message: false,
              supports_chat: false
            }
          },
          region: {
            region_id: '5b3513e4b2a202a462ebcba7',
            self_link: '/v1/providers/5afae79139e051a014b06b0b/regions/5b3513e4b2a202a462ebcba7',
            car_types: [
              {
                type: 'standard',
                cancellation_fee: 500,
                cancellation_time: 300,
                minimum_price: 0
              },
              {
                type: 'exec',
                cancellation_fee: 300,
                cancellation_time: 600,
                minimum_price: 100
              }
            ],
            payment_types: [
              'online'
            ],
            currency_code: 'AED',
            flags: {
              supports_optional_dropoff: false
            }
          }
        }
      ]
    }.to_json
  end

  let(:normalized_response) do
    {
      providers: [
        {
          supplier: 'Splyt: Careem',
          provider_id: '5afae79139e051a014b06b0b',
          region_id:   '5b3513e4b2a202a462ebcba7',
          car_types: [
            'standard',
            'exec'
          ],
          supports_driver_message: false,
          supports_flight_number: false
        }
      ]
    }
  end

  before { stub_request(:get, url_with_params).to_return(status: 200, body: response) }

  context 'when there is asap booking' do
    describe '#execute' do
      it 'sends get request and returns providers' do
        expect(service.execute.result.body).to eq(response)
      end
    end

    describe '#normalized_response' do
      it 'returns normalized hash' do
        expect(service.execute.normalized_response).to eq(normalized_response)
      end
    end
  end

  context 'when there is future booking' do
    let(:booking_type) { 'future' }

    describe '#execute' do
      it 'sends get request and returns providers' do
        expect(service.execute.result.body).to eq(response)
      end
    end

    describe '#normalized_response' do
      it 'returns normalized hash' do
        expect(service.execute.normalized_response).to eq(normalized_response)
      end
    end
  end

  context 'when there is no display_name in response' do
    let(:response) do
      {
        providers: [
          {
            provider: {
              provider_id: '5afae79139e051a014b06b0b',
              self_link: '/v1/providers/5afae79139e051a014b06b0b',
              logo: 'https://image.splytech.io/partner-logos/careem.png',
              flags: {
                supports_flight_number: false,
                supports_driver_message: false,
                supports_chat: false
              }
            },
            region: {
              region_id: '5b3513e4b2a202a462ebcba7',
              self_link: '/v1/providers/5afae79139e051a014b06b0b/regions/5b3513e4b2a202a462ebcba7',
              car_types: [
                {
                  type: 'standard',
                  cancellation_fee: 500,
                  cancellation_time: 300,
                  minimum_price: 0
                },
                {
                  type: 'exec',
                  cancellation_fee: 300,
                  cancellation_time: 600,
                  minimum_price: 100
                }
              ],
              payment_types: [
                'online'
              ],
              currency_code: 'AED',
              flags: {
                supports_optional_dropoff: false
              }
            }
          }
        ]
      }.to_json
    end

    let(:normalized_response) do
      {
        providers: [
          {
            supplier: 'Splyt',
            provider_id: '5afae79139e051a014b06b0b',
            region_id:   '5b3513e4b2a202a462ebcba7',
            car_types: [
              'standard',
              'exec'
            ],
            supports_driver_message: false,
            supports_flight_number: false
          }
        ]
      }
    end

    it 'returns normalized hash' do
      expect(service.execute.normalized_response).to eq(normalized_response)
    end
  end
end
