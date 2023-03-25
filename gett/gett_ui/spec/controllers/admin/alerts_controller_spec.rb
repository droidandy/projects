require 'rails_helper'

RSpec.describe Admin::AlertsController, type: :controller do
  let(:admin) { create :user, :admin }

  before { sign_in admin }

  it_behaves_like 'service controller', module: Admin::Alerts do
    delete :destroy do
      params { { id: '123' } }
      expected_service_attributes { { alert_id: '123' } }
      expected_response(204)
    end
  end
end
