require 'rails_helper'

RSpec.describe PaymentCardsController, type: :controller do
  let(:company)   { create :company }
  let(:admin)     { create :admin, company: company }
  let(:passenger) { create :passenger, company: company }
  let!(:card)     { create :payment_card, passenger: passenger }

  before { sign_in admin }

  it_behaves_like 'service controller', module: PaymentCards do
    post :create do
      params { { passenger_id: passenger.id, payment_card: {token: 'token123'} } }

      expected_service_attributes { { passenger: passenger, params: as_params(token: 'token123') } }

      on_success do
        stub_service(as_json: 'payment card values')
        expected_response(200 => 'payment card values')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    delete :destroy do
      params { { passenger_id: passenger.id, id: card.id } }

      expected_service_attributes { { payment_card: card } }

      on_success do
        expected_response(200)
      end

      on_failure do
        expected_response(422)
      end
    end
  end
end
