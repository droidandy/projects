require 'rails_helper'

RSpec.describe TravelReasonsController, type: :controller do
  let(:company)        { create :company }
  let(:admin)          { create :admin, company: company }
  let!(:travel_reason) { create :travel_reason, company: company }

  before { sign_in admin }

  it_behaves_like 'service controller', module: TravelReasons do
    get :index do
      stub_service(result: 'travel reasons list')

      expected_response(200 => 'travel reasons list')
    end

    post :create do
      params { { travel_reason: {name: 'reason'} } }

      expected_service_attributes { { params: as_params(name: 'reason') } }

      on_success do
        stub_service(result: 'travel reason values')
        expected_response(200 => 'travel reason values')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    put :update do
      params { { id: travel_reason.id, travel_reason: {name: 'foo'} } }

      expected_service_attributes { { travel_reason: travel_reason, params: as_params(name: 'foo') } }

      on_success do
        stub_service(result: 'travel reason values')
        expected_response(200 => 'travel reason values')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    delete :destroy do
      params { { id: travel_reason.id } }

      expected_service_attributes { { travel_reason: travel_reason } }

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
