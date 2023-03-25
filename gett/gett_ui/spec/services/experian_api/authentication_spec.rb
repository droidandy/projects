require 'rails_helper'

RSpec.describe ExperianApi::Authenticate, type: :service do
  subject(:service) { described_class.new }

  describe '#execute' do
    let(:response) do
      {
        status: 200,
        body: <<~JSON
          {
            "issued_at" : "1517492762186",
            "expires_in" : "14400",
            "token_type" : "Bearer",
            "access_token" : "eyJraWQiOiJBSmpTMXJQQjdJODBHWjgybm",
            "refresh_token" : "LsmzZdE7WmRoXRNdknAryn1x3in7uAWJ"
          }
        JSON
      }
    end

    after(:each) do
      # token_data is class attributes and caches between tests
      ExperianApi::Base.token_data = nil
    end

    context 'when token is blank' do
      before do
        stub_request(:post, 'https://experian-api.localhost/oauth2/v1/token')
          .with(
            body: '{"username":"test","password":"test"}',
            headers: {
              content_type:   'application/json',
              'Client_id'     => 'test',
              'Client_secret' => 'test'
            }
          )
          .to_return(response)
      end

      it 'succeeds service' do
        service.execute
        is_expected.to be_success
      end

      it 'sets token' do
        service.execute
        expect(described_class.token_data).to be_present
      end

      context 'when Experian API raises exception' do
        let(:response) { {status: 400, body: 'Error'} }

        it 'does not succeed' do
          expect(Airbrake).to receive(:notify)
          expect { service.execute }.to raise_error('Authentication was failed')
        end
      end
    end

    context 'when tokes exists' do
      before do
        ExperianApi::Base.token_data = { 'issued_at' => Time.current.to_i, 'expires_in' => 1000 }
      end

      it 'does not call Experian API' do
        service.execute
        expect(WebMock).not_to have_requested(:post, 'https://experian-api.localhost/oauth2/v1/token')
      end

      it 'succeeds service' do
        service.execute
        is_expected.to be_success
      end
    end
  end
end
