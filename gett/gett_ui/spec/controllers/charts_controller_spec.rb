require 'rails_helper'

RSpec.describe ChartsController, type: :controller do
  let(:member) { create :member }

  before { sign_in member }

  it_behaves_like 'service controller', module: Charts do
    get :index do
      stub_service(result: 'statistics')
      expected_service_attributes { { with_linked_companies: false } }

      expected_response(200 => 'statistics')
    end
  end
end
