require 'rails_helper'

RSpec.describe Mobile::V1::AddressesController, type: :controller do
  let(:admin) { create :admin }

  before { sign_in admin }

  it_behaves_like 'service controller', module: Mobile::V1::Addresses do
    get :index do
      let(:service_class) { ::Addresses::Index }

      params { {string: 'Sherlock', countries_filter: ['uk']} }

      expected_service_attributes { {string: 'Sherlock', countries_filter: ['uk']} }

      on_success do
        stub_service(result: 'list')
        expected_response(200 => 'list')
      end

      on_failure do
        expected_response(404)
      end
    end

    get :geocode do
      params { {location_id: '1233212443'} }

      expected_service_attributes { {location_id: '1233212443'} }

      on_success do
        stub_service(result: 'result')
        expected_response(200 => 'result')
      end

      on_failure do
        expected_response(404)
      end
    end

    get :quick_search do
      params { {lat: 1, lng: 2, criterion: 'airport'} }

      expected_service_attributes { {lat: '1', lng: '2', criterion: 'airport'} }

      on_success do
        stub_service(result: 'result')
        expected_response(200 => 'result')
      end

      on_failure do
        expected_response(404)
      end
    end
  end
end
