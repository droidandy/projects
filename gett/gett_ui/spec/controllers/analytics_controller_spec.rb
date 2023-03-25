require 'rails_helper'

RSpec.describe AnalyticsController, type: :controller do
  let(:admin) { create(:admin) }

  before { sign_in admin }

  it_behaves_like 'service controller' do
    post :event do
      params { { event: { name: 'TEST', properties: { company_name: 'name' } } } }

      let(:service_class) { Gett::Analytics::PostEvent }

      expected_service_attributes { { event: as_params(name: 'TEST', properties: { company_name: 'name' }) } }

      on_success do
        expected_response(200)
      end

      on_failure do
        expected_response(422)
      end
    end
  end
end
