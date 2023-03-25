require 'rails_helper'

RSpec.describe Mobile::V1::MessagesController, type: :controller do
  let(:passenger) { create(:passenger) }

  before { sign_in passenger }

  it_behaves_like 'service controller', module: Mobile::V1::Messages do
    get :recent do
      stub_service(result: 'list')
      expected_response(200 => 'list')
    end
  end
end
