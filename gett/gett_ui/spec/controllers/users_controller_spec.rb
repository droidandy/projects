require 'rails_helper'

RSpec.describe UsersController, type: :controller do
  let!(:user) { create :user, :with_password_reset }

  it_behaves_like 'service controller', module: Users do
    put :forgot_password do
      params { { email: user.email } }

      expected_service_attributes { { email: user.email } }

      expected_response(200)
    end

    put :reset_password do
      params { { user: { reset_password_token: 'token', password: '12345678', password_confirmation: '12345678' } } }

      expected_service_attributes do
        {
          params: as_params(reset_password_token: 'token', password: '12345678', password_confirmation: '12345678')
        }
      end

      on_success do
        before { expect(JsonWebToken).to receive(:encode).with(id: 1).and_return('token') }
        stub_service{ { user: double(id: 1, realm: 'app') } }
        expected_response(200 => {token: 'token', realm: 'app'}.to_json)
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    put :update_password do
      params { { user: { current_password: '123123123', password: '12345678', password_confirmation: '12345678' } } }

      expected_service_attributes do
        {
          params: as_params(current_password: '123123123', password: '12345678', password_confirmation: '12345678')
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
  end
end
