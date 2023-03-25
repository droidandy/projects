require 'rails_helper'

RSpec.describe Admin::UsersController, type: :controller do
  let(:company) { create :company }
  let(:admin)   { create :user, :admin }
  let(:user)    { create :user, :admin }

  before { sign_in admin }

  it_behaves_like 'service controller', module: Admin::Users do
    get :index do
      stub_service(result: 'users list')

      expected_response(200 => 'users list')
    end

    get :new do
      let(:service_class) { Admin::Users::Form }

      stub_service(result: 'users form data')

      expected_response(200 => 'users form data')
    end

    post :create do
      params { { user: { first_name: 'Name' } } }

      expected_service_attributes { { params: as_params(first_name: 'Name') } }

      on_success do
        expected_response(200)
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    get :edit do
      let(:service_class) { Admin::Users::Form }

      params { { id: user.id } }

      expected_service_attributes { { user: user } }

      stub_service(result: 'users form data')

      expected_response(200 => 'users form data')
    end

    put :update do
      params { { id: user.id, user: {first_name: 'name'} } }

      expected_service_attributes { { user: user, params: as_params(first_name: 'name') } }

      on_success do
        expected_response(200)
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    get :verify_email do
      params { { email: 'email@email.com' } }

      expected_service_attributes { { email: 'email@email.com', id: nil } }

      stub_service(result: 'email@email.com')
      expected_response(200 => 'email@email.com')
    end
  end
end
