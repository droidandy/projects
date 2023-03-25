require 'rails_helper'

RSpec.describe Admin::MessagesController, type: :controller do
  let(:admin) { create :user, :admin }

  before { sign_in admin }

  it_behaves_like 'service controller', module: Admin::Messages do
    get :index do
      stub_service(result: 'messages list')

      expected_response(200 => 'messages list')
    end

    post :create do
      params { { message: {body: 'body'} } }

      expected_service_attributes { { params: as_params(body: 'body') } }
      stub_service(result: 'message values')

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
