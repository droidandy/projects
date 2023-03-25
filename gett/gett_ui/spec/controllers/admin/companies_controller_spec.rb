require 'rails_helper'

RSpec.describe Admin::CompaniesController, type: :controller do
  let(:admin)   { create :user, :admin }
  let(:company) { create :company }

  before { sign_in admin }

  it_behaves_like 'service controller', module: Admin::Companies do
    get :index do
      stub_service(result: 'companies list')

      expected_response(200 => 'companies list')
    end

    get :new do
      let(:service_class) { Admin::Companies::Form }

      stub_service(result: 'form values')

      expected_response(200 => 'form values')
    end

    get :edit do
      let(:service_class) { Admin::Companies::Form }

      params { { id: company.id } }

      expected_service_attributes { { company: company } }
      stub_service(result: 'company values')

      expected_response(200 => 'company values')
    end

    get :log do
      let(:service_class) { Admin::Companies::AuditLog }

      params { { id: company.id } }

      expected_service_attributes { { company: company } }

      stub_service(result: 'company change log')

      expected_response(200 => 'company change log')
    end

    post :create do
      params { { company: {name: 'foo'} } }

      expected_service_attributes { { params: as_params(name: 'foo') } }
      stub_service(result: 'company values')

      on_success do
        expected_response(200 => 'company values')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    put :update do
      params { { id: company.id, company: {name: 'foo'} } }

      expected_service_attributes { { company: company, params: as_params(name: 'foo') } }
      stub_service(result: 'company values')

      on_success do
        expected_response(200 => 'company values')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    put :toggle_status do
      let(:service_class) { Admin::Companies::ToggleStatus }

      params { { id: company.id } }

      expected_service_attributes { { company: company } }

      expected_response(200)
    end

    delete :destroy do
      params { { id: company.id } }

      expected_service_attributes { { company: company } }

      on_success do
        expected_response(200)
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422)
      end
    end

    post :verify_gett do
      let(:service_class) { Gett::Products }

      params do
        {
          gett_business_id: 'TestBusinessId',
          latitude: '1',
          longitude: '1'
        }
      end

      expected_service_attributes do
        {
          verify_business_id: 'TestBusinessId',
          address: as_params(latitude: '1', longitude: '1')
        }
      end

      on_success do
        expected_response(200)
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    post :verify_ot do
      let(:service_class) { OneTransport::ProfileLookup }
      params { { ot_username: 'Username', ot_client_number: 'ClientNumber' } }

      expected_service_attributes { { ot_username: 'Username', ot_client_number: 'ClientNumber' } }

      on_success do
        expected_response(200)
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    get :stats do
      let(:service_class) { Admin::Statistics::Company }
      params { { id: company.id } }
      expected_service_attributes { { company: company } }
      stub_service(result: 'statistics')
      expected_response(200 => 'statistics')
    end
  end
end
