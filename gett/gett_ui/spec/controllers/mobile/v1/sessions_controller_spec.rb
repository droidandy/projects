require 'rails_helper'

RSpec.describe Mobile::V1::SessionsController, type: :controller do
  let(:member)  { create(:member) }
  let(:booking) { create(:booking, booker: member) }

  before { sign_in member }

  it_behaves_like 'service controller', module: Mobile::V1::Sessions do
    post :create do
      let(:service_class) { ::Sessions::Create }

      params { {user: {email: 'user@fakemail.com', password: '123123123'}} }

      expected_service_attributes { {params: as_params(email: 'user@fakemail.com', password: '123123123'), api_type: 'mobile'} }

      on_success do
        stub_service(result: 'session data')
        expected_response(200 => 'session data')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(401 => {error: 'errors'}.to_json)
      end
    end

    get :show do
      stub_service(result: 'session values')

      expected_response(200 => 'session values')
    end
  end
end
