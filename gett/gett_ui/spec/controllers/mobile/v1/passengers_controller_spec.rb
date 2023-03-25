require 'rails_helper'

RSpec.describe Mobile::V1::PassengersController, type: :controller do
  let(:company)   { create(:company) }
  let(:admin)     { create(:admin, company: company) }
  let(:passenger) { create(:passenger, company: company) }

  before { sign_in admin }

  it_behaves_like 'service controller', module: Mobile::V1::Passengers do
    get :edit do
      let(:service_class) { Passengers::Form }

      params { { id: passenger.id } }

      expected_service_attributes { { passenger: passenger } }

      stub_service(result: 'passengers form data')

      expected_response(200 => 'passengers form data')
    end
  end
end
