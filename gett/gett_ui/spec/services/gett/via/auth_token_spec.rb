require 'rails_helper'

RSpec.describe ::Gett::Via::AuthToken, type: :service do
  describe '#execute' do
    subject(:service) { described_class.new }

    let(:redis_stub) { double(multi: nil, set: nil, expire: nil, get: redis_access_token) }
    let(:redis_access_token) { nil }
    let(:access_token) { 42 }
    let(:expires_in) { 3600 }
    let(:body) { {access_token: access_token, expires_in: expires_in}.to_json }

    before do
      allow(Settings.via).to receive(:oauth2_host).and_return('http://localhost')
      stub_request(:post, 'http://localhost/oauth2/token?grant_type=client_credentials')
        .to_return(status: 200, body: body)
      expect(service).to receive(:redis).at_least(:once).and_return(redis_stub)
    end

    describe '#execute' do
      describe 'if redis is empty' do
        it 'should be success' do
          expect(service).to receive(:store_access_token!).with(access_token, expires_in - 5).and_call_original
          expect(service.execute.result).to eq(access_token)
        end
      end

      describe 'if an access token is not expired yet' do
        let(:redis_access_token) { access_token }

        it 'should be success' do
          expect(service).not_to receive(:store_access_token!)
          expect(service.execute.result).to eq(access_token)
        end
      end

      describe 'if expires in is absence of the responce' do
        let(:expires_in) { nil }

        it 'should not store data in redis' do
          expect(redis_stub).to_not receive(:multi)
          expect(redis_stub).to_not receive(:set)
          expect(redis_stub).to_not receive(:expire)
          expect(service.execute.result).to eq(access_token)
        end
      end
    end
  end
end
