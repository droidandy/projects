require 'rails_helper'

RSpec.describe BookersController, type: :controller do
  let(:company) { create :company }
  let(:admin)   { create :admin, company: company }
  let!(:booker) { create :booker, company: company }

  before { sign_in admin }

  it_behaves_like 'service controller', module: Bookers do
    get :index do
      stub_service(result: 'bookers list')

      expected_response(200 => 'bookers list')
    end

    get :show do
      params { { id: booker.id } }

      expected_service_attributes { { booker: booker } }
      stub_service(result: 'booker details')

      expected_response(200 => 'booker details')
    end

    get :log do
      let(:service_class) { Bookers::AuditLog }

      params { { id: booker.id } }

      expected_service_attributes { { booker: booker } }

      stub_service(result: 'booker change log')

      expected_response(200 => 'booker change log')
    end

    get :new do
      let(:service_class) { Bookers::Form }

      stub_service(result: 'bookers form data')

      expected_response(200 => 'bookers form data')
    end

    post :create do
      params { { booker: {first_name: 'foo'} } }

      expected_service_attributes { { params: as_params(first_name: 'foo') } }

      on_success do
        expected_response(200)
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    get :edit do
      let(:service_class) { Bookers::Form }

      params { { id: booker.id, booker: {first_name: 'foo'} } }

      expected_service_attributes { { booker: booker } }

      stub_service(result: 'bookers form data')

      expected_response(200 => 'bookers form data')
    end

    put :update do
      params { { id: booker.id, booker: {first_name: 'foo'} } }

      expected_service_attributes { { booker: booker, params: as_params(first_name: 'foo') } }

      on_success do
        stub_service(show_result: 'booker values')
        expected_response(200 => 'booker values')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    delete :destroy do
      params { { id: booker.id } }

      expected_service_attributes { { booker: booker } }

      on_success do
        expected_response(200)
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    get :export do
      stub_service(result: 'bookings data')

      expected_response(200 => 'bookings data')
    end

    put :toggle_passenger do
      params { { id: booker.id } }

      expected_service_attributes { { booker: booker, passenger: admin } }

      on_success do
        stub_service(show_result: 'booker values')
        expected_response(200 => 'booker values')
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end
  end
end
