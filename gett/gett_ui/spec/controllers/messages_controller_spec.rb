require 'rails_helper'

RSpec.describe MessagesController, type: :controller do
  let(:company) { create :company }
  let(:admin)   { create :admin, company: company }

  before { sign_in admin }

  it_behaves_like 'service controller', module: Messages do
    post :create do
      let(:service_class) { Messages::CreateInternal }

      params { { message: {body: 'body'} } }

      expected_service_attributes { { params: as_params(body: 'body') } }

      on_success do
        expected_response(200)
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    put :mark_all_as_read do
      expected_response(200)
    end

    get :unread do
      stub_service(result: 'messages list')

      expected_response(200 => 'messages list')
    end
  end
end
