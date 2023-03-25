require 'rails_helper'

RSpec.describe FlightstatsController, type: :controller do
  let(:admin)   { create(:admin) }
  let(:booking) { create(:booking, booker: admin) }

  before { sign_in admin }

  it_behaves_like 'service controller', module: Flightstats do
    get :flights do
      params { { flight: 'ABC123' } }

      expected_service_attributes { as_params(flight: 'ABC123') }

      on_success do
        stub_service(result: 'flights')
        expected_response(200 => 'flights')
      end

      on_failure do
        expected_response(404)
      end
    end

    get :schedule do
      params { { flight: 'ABC123' } }

      expected_service_attributes { as_params(flight: 'ABC123') }

      on_success do
        stub_service(result: 'schedule')
        expected_response(200 => 'schedule')
      end

      on_failure do
        expected_response(404)
      end
    end
  end
end
