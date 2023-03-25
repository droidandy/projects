require 'rails_helper'

RSpec.describe SessionsController, type: :controller do
  before { request.headers.merge!('X-API-Type' => 'mobile') }

  it_behaves_like 'service controller', module: Sessions do
    post :create do
      params { { user: { email: 'email@email.com', password: '12345', captcha_response: 'captcha' } } }
      expected_service_attributes do
        {
          params: as_params(
            email:            'email@email.com',
            password:         '12345',
            captcha_response: 'captcha'
          ),
          api_type: 'mobile'
        }
      end

      on_success do
        stub_service(result: {token: 'token', realms: ['realm']})
        expected_response(200 => {token: 'token', realms: ['realm']}.to_json)
      end

      on_failure do
        stub_service(errors: 'error message')
        expected_response(401 => {error: 'error message'}.to_json)
      end
    end

    put :onboard do
      let(:booker) { create :booker }

      before { sign_in booker }

      on_success do
        expected_response(200)
      end
    end
  end
end
