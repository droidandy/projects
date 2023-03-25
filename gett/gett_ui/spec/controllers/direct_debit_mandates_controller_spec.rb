require 'rails_helper'

RSpec.describe DirectDebitMandatesController, type: :controller do
  let(:company) { create(:company) }
  let(:admin)   { create(:admin, company: company) }

  before { sign_in admin }

  it_behaves_like 'service controller', module: DirectDebitMandates do
    get :show do
      stub_service(result: 'mandate')
      expected_response(200 => 'mandate')
    end

    post :create do
      on_success do
        stub_service(result: 'redirect_url')
        expected_response(200 => {redirect_url: 'redirect_url'}.to_json)
      end

      on_failure do
        expected_response(422)
      end
    end

    post :complete do
      params { { redirect_flow_id: '1' } }
      expected_service_attributes { { redirect_flow_id: '1' } }

      on_success do
        stub_service(result: 'mandate')
        expected_response(200 => 'mandate')
      end

      on_failure do
        expected_response(422)
      end
    end
  end
end
