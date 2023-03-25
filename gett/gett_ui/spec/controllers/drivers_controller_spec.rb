require 'rails_helper'

RSpec.describe DriversController, type: :controller do
  let(:company)    { create :company }
  let(:admin)      { create :admin, company: company }

  before { sign_in admin }

  it_behaves_like 'service controller', module: Drivers do
    get :channel do
      params { { lat: 5.53, lng: 6.25 } }
      expected_service_attributes { { params: as_params(lat: '5.53', lng: '6.25') } }

      let(:service_class) { Drivers::FetchChannel }

      stub_service(result: 'channel')

      expected_response(200 => { channel: 'channel' }.to_json)
    end
  end
end
