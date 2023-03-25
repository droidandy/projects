require 'rails_helper'

RSpec.describe ReferenceEntriesController, type: :controller do
  let(:admin) { create :admin }
  let(:booking_reference) { create :booking_reference }

  before { sign_in admin }

  it_behaves_like 'service controller', module: ReferenceEntries do
    get :index do
      params { { booking_reference_id: booking_reference.id, search_term: 'hi' } }

      stub_service(result: 'reference entries list')

      expected_response(200 => 'reference entries list')
    end
  end
end
