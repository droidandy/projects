require 'rails_helper'

RSpec.describe Admin::PredefinedAddressesController, type: :controller do
  let(:admin) { create :user, :superadmin }
  let(:predefined_address) { create :predefined_address }

  before { sign_in admin }

  it_behaves_like 'service controller', module: Admin::PredefinedAddresses do
    get :index do
      stub_service(result: 'predefined_addresses list')

      expected_response(200 => 'predefined_addresses list')
    end

    post :create do
      params { { predefined_address: {line: 'predefined_address'} } }

      expected_service_attributes { { params: as_params(line: 'predefined_address') } }

      on_success do
        stub_service(show_result: 'address values')
        expected_response(200 => 'address values')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    put :update do
      params { { id: predefined_address.id, predefined_address: {line: 'foo'} } }

      expected_service_attributes { { predefined_address: predefined_address, params: as_params(line: 'foo') } }

      on_success do
        stub_service(show_result: 'address values')
        expected_response(200 => 'address values')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    delete :destroy do
      params { { id: predefined_address.id } }

      expected_service_attributes { { predefined_address: predefined_address } }

      on_success do
        expected_response(200)
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    get :validate_postal_code do
      let(:service_class) { Admin::PredefinedAddresses::PostalCodeValidator }

      params { { postal_code: 'foo' } }

      expected_service_attributes { { postal_code: 'foo' } }

      on_success do
        expected_response(200)
      end

      on_failure do
        expected_response(404)
      end
    end
  end
end
