require 'rails_helper'

RSpec.describe PassengerAddressesController, type: :controller do
  let(:company)   { create(:company) }
  let(:admin)     { create(:admin, company: company) }
  let(:passenger) { create(:passenger, company: company) }
  let!(:address)  { create(:passenger_address, passenger: passenger) }

  before { sign_in admin }

  it_behaves_like 'service controller', module: PassengerAddresses do
    post :create do
      params { { passenger_id: passenger.id, passenger_address: {name: 'address 1', type: 'favorite', address: {line: 'foo', lat: '1.0', lng: '2.0'}} } }

      expected_service_attributes { { passenger: passenger, params: as_params(name: 'address 1', type: 'favorite', address: {line: 'foo', lat: '1.0', lng: '2.0'}) } }

      on_success do
        stub_service(as_json: 'passenger address values')
        expected_response(200 => 'passenger address values')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    put :update do
      params { { passenger_id: passenger.id, id: address.id, passenger_address: {name: 'foo'} } }

      expected_service_attributes { { passenger_address: address, params: as_params(name: 'foo') } }

      on_success do
        stub_service(as_json: 'passenger address values')
        expected_response(200 => 'passenger address values')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    delete :destroy do
      params { { passenger_id: passenger.id, id: address.id } }

      expected_service_attributes { { passenger_address: address } }

      on_success do
        expected_response(200)
      end

      on_failure do
        expected_response(422)
      end
    end
  end
end
