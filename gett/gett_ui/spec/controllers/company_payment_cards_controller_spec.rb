require 'rails_helper'

RSpec.describe CompanyPaymentCardsController, type: :controller do
  before { sign_in create(:admin) }

  it_behaves_like 'service controller', module: CompanyPaymentCards do
    get :show do
      stub_service(result: 'company payment card')

      expected_response(200 => 'company payment card')
    end

    put :update do
      params { { payment_card: {token: '123'} } }

      stub_service(show_result: 'company payment card')

      expected_service_attributes { { params: as_params(token: '123') } }

      on_success do
        expected_response(200 => 'company payment card')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end
  end
end
