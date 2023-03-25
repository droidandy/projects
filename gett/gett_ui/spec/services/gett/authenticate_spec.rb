require 'rails_helper'

RSpec.describe Gett::Authenticate, type: :service do
  subject(:service) { described_class.new }

  describe '#execute' do
    let(:params) do
      {
        grant_type:    :client_credentials,
        client_id:     'TestClientId',
        client_secret: 'TestClientSecret',
        scope:         :business
      }
    end

    after(:each) do
      # token_data is class attributes and caches between tests
      described_class.token_data = nil
    end

    context 'when token is blank' do
      context 'when Gett API responds successfully' do
        let(:body) { {'created_at' => Time.current.to_i, 'expires_in' => 1000}.to_json }

        before do
          stub_request(:post, "http://localhost/oauth/token?#{params.to_param}")
            .with(body: params.to_json)
            .to_return(status: 200, body: body)
        end

        it 'succeeds service' do
          service.execute
          is_expected.to be_success
        end

        it 'sets token' do
          service.execute
          expect(described_class.token_data).to be_present
        end
      end

      context 'when Gett API raises exception' do
        before do
          stub_request(:post, "http://localhost/oauth/token?#{params.to_param}")
            .to_return(status: 400, body: 'Error')
        end

        it 'does not succeed' do
          expect(Airbrake).to receive(:notify)
          expect{ service.execute }.to raise_error('Gett Authentication was failed')
        end
      end
    end

    context 'when tokes exists' do
      before do
        described_class.token_data = { 'created_at' => Time.current.to_i, 'expires_in' => 1000 }
      end

      it 'does not call Gett API' do
        expect(RestClient).not_to receive(:post)
        service.execute
      end

      it 'succeeds service' do
        service.execute
        is_expected.to be_success
      end
    end
  end
end
