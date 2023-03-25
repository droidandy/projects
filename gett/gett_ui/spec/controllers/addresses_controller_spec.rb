require 'rails_helper'

RSpec.describe AddressesController, type: :controller do
  let(:admin) { create :admin }

  before { sign_in admin }

  it_behaves_like 'service controller', module: Addresses do
    get :index do
      params { { string: 'Sherlock', countries_filter: ['uk'] } }

      expected_service_attributes { { string: 'Sherlock', countries_filter: ['uk'] } }

      on_success do
        stub_service(result: { list: { 'Items' => [] } })
        expected_response(200 => { list: { 'Items' => [] } }.to_json)
      end

      on_failure do
        expected_response(404)
      end
    end

    get :geocode do
      params { { location_id: '1233212443' } }

      expected_service_attributes do
        {
          location_id: '1233212443',
          string: nil,
          google: nil,
          predefined: nil,
          lat: nil,
          lng: nil
        }
      end

      on_success do
        stub_service(result: { lat: 39.6034810, lng: -119.6822510 })
        expected_response(200 => { lat: 39.6034810, lng: -119.6822510 }.to_json)
      end

      on_failure do
        expected_response(404)
      end
    end
  end
end
