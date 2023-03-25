require 'rails_helper'

RSpec.describe LocationsController, type: :controller do
  let(:company)  { create :company }
  let(:admin)    { create :admin, company: company }
  let(:location) { create :location, company: company }
  let(:address_params) do
    {
      line: 'line',
      lat: 'lat',
      lng: 'lng',
      postal_code: 'postal_code',
      country_code: 'country_code'
    }
  end

  before { sign_in admin }

  it_behaves_like 'service controller', module: Locations do
    get :index do
      stub_service(result: 'locations list')

      expected_response(200 => 'locations list')
    end

    post :create do
      params { { location: { name: 'location', address: address_params } } }

      expected_service_attributes do
        {
          params: as_params(
            name: 'location',
            address: { line: 'line', lat: 'lat', lng: 'lng', postal_code: 'postal_code', country_code: 'country_code' }
          )
        }
      end

      on_success do
        stub_service(show_result: 'location values')
        expected_response(200 => 'location values')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    put :update do
      params { { id: location.id, location: { name: 'foo' } } }

      expected_service_attributes { { location: location, params: as_params(name: 'foo') } }

      on_success do
        stub_service(show_result: 'location values')
        expected_response(200 => 'location values')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    delete :destroy do
      params { { id: location.id } }

      expected_service_attributes { { location: location } }

      on_success do
        expected_response(200)
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    put :default do
      params { { id: location.id } }

      expected_service_attributes { { location: location } }

      on_success do
        stub_service(show_result: 'location values')
        expected_response(200 => 'location values')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end
  end
end
