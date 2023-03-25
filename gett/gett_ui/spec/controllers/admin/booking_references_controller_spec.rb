require 'rails_helper'

RSpec.describe Admin::BookingReferencesController, type: :controller do
  let(:admin)   { create :user, :admin }
  let(:company) { create :company }

  let(:booking_reference) { create :booking_reference, company: company }

  before { sign_in admin }

  it_behaves_like 'service controller', module: Admin::BookingReferences do
    post :create do
      params { { company_id: company.id, booking_reference: {name: 'foo'} } }

      expected_service_attributes { { company: company, params: as_params(name: 'foo') } }

      on_success do
        expected_response(200)
      end

      on_failure do
        stub_service(errors: 'errors')
        expected_response(422 => {errors: 'errors'}.to_json)
      end
    end

    put :update do
      params { { id: booking_reference.id, booking_reference: {name: 'foo'} } }

      expected_service_attributes { { booking_reference: booking_reference, params: as_params(name: 'foo') } }

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
