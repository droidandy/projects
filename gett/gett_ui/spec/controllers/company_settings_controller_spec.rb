require 'rails_helper'

RSpec.describe CompanySettingsController, type: :controller do
  let(:admin) { create :admin }

  before { sign_in admin }

  it_behaves_like 'service controller', module: CompanySettings do
    get :show do
      stub_service(result: 'company settings values')

      expected_response(200 => 'company settings values')
    end

    put :update do
      before do
        allow(Companies::Dashboard).to receive_message_chain(:new, :execute, :result)
          .and_return('dashboard_response')
      end

      params { { company: { primary_contact: { phone: 'new phone' } } } }

      expected_service_attributes { { params: as_params(primary_contact: { phone: 'new phone' }) } }

      expected_response(200 => 'dashboard_response')
    end
  end
end
