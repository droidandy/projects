require 'rails_helper'

RSpec.describe Admin::ReferenceEntriesController, type: :controller do
  let(:admin) { create :user }
  let(:booking_reference) { create :booking_reference }

  before { sign_in admin }

  it_behaves_like 'service controller', module: Admin::ReferenceEntries do
    get :index do
      params { { booking_reference_id: booking_reference.id, search_term: 'hi' } }

      stub_service(result: 'reference entries list')

      expected_response(200 => 'reference entries list')
    end
  end
end
