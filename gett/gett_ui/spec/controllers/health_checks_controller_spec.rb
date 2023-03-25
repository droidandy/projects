require 'rails_helper'

RSpec.describe HealthChecksController, type: :controller do
  specify 'GET #show' do
    get(:show)
    expect(response.status).to eq(200)
    expect(response.body).to be_blank
  end
end
