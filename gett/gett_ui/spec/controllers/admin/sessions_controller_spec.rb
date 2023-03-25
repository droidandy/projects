require 'rails_helper'

RSpec.describe Admin::SessionsController, type: :controller do
  let(:admin) { create :user, :admin }

  before { sign_in admin }

  it_behaves_like 'service controller', module: Admin::Sessions do
    get :show do
      stub_service(result: 'app data')

      expected_response(200 => 'app data')
    end

    post :reincarnate do
      let(:admin)   { create :user, :admin }
      let(:company) { create :company }

      params { { company_id: company.id, password: 'password' } }
      expected_service_attributes { { company_id: company.id.to_s, password: 'password' } }

      on_success do
        stub_service(result: {token: 'token', realm: 'realm'})
        expected_response(200 => {token: 'token', realm: 'realm'}.to_json)
      end

      on_failure do
        stub_service(errors: 'error message')
        expected_response(401 => {error: 'error message'}.to_json)
      end
    end

    post :ascend do
      stub_service(result: {token: 'token', realm: 'admin'})
      expected_response(200 => {token: 'token', realm: 'admin'}.to_json)
    end
  end
end
