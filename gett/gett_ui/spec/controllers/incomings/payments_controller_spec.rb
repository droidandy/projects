require 'rails_helper'

RSpec.describe Incomings::PaymentsController, type: :controller do
  it_behaves_like 'service controller' do
    post :create do
      let(:service_class) { Payments::Webhook }

      params { { id: 'payments_os_id' } }

      expected_service_attributes { { payments_os_id: 'payments_os_id' } }

      stub_service(result: nil)

      expected_response(200)
    end
  end
end
