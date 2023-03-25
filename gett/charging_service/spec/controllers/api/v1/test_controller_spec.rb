require 'rails_helper'

RSpec.describe Api::V1::TestController, type: :controller do
  it 'returns 200' do
    get :test
    expect(response).to have_http_status(:ok)
    expect(response.body).to eq({ test: Gett::Core::VERSION }.to_json)
  end
end
