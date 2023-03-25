require 'rails_helper'

RSpec.describe Incomings::GoCardlessController, type: :controller do
  it_behaves_like 'service controller' do
    post :create do
      let(:service_class) { GoCardless::Webhook }

      params { { events: ['event'] } }

      before do
        expect_any_instance_of(GoCardlessWebhookAuthenticator)
          .to receive(:authenticate).and_return(true)
      end

      expected_response(200)
    end
  end
end
