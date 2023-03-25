require 'rails_helper'

RSpec.describe Splyt::Estimate do
  subject(:service) { described_class.new(attributes) }

  let(:attributes) do
    {
      provider_id:     provider_id,
      region_id:       region_id,
      car_type:        car_type,
      pickup_address:  pickup_address,
      dropoff_address: dropoff_address,
      booking_type:    booking_type
    }
  end

  let(:pickup_address)  { { lat: 1.0, lng: 55.249618999999996 } }
  let(:dropoff_address) { { lat: 2.0, lng: 2.0 } }
  let(:car_type)        { 'standard' }
  let(:provider_id)     { 1 }
  let(:api_url)         { Settings.splyt.api_url }
  let(:region_id)       { 1 }
  let(:booking_type)    { 'now' }

  let(:response) do
    {
      estimate_id: '5b44e78ecb71921ce0ef7136',
      estimated: {
        pickup_eta: 2,
        journey_eta: 36,
        price_range: {
          lower: 4469,
          upper: 5361
        },
        price_range_formatted: {
          lower: '£44.69',
          upper: '£53.61'
        }
      },
      currency: {
        code: 'GBP',
        decimal_point_symbol: {
          position: 2
        },
        currency_symbol: {
          value: '£',
          prepend: true
        }
      }
    }.to_json
  end

  let(:url_with_params) do
    "#{api_url}/v2/providers/1/regions/1/estimate?booking_type=now&car_type=standard&currency_code=GBP" \
      '&dropoff_latitude=2.0&dropoff_longitude=2.0&pickup_latitude=1.0&pickup_longitude=55.249619'
  end

  before { stub_request(:get, url_with_params).to_return(status: 200, body: response) }

  describe '#execute' do
    it 'sends get request and returns an estimate' do
      expect(service.execute.result.body).to eq(response)
    end
  end

  describe '#normalized_response' do
    let(:normalized_response) do
      {
        estimate_id: '5b44e78ecb71921ce0ef7136',
        eta:         2,
        lower_price: 4469
      }
    end

    it 'returns normalized hash' do
      expect(service.execute.normalized_response).to eq(normalized_response)
    end
  end
end
