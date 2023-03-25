require 'rails_helper'

RSpec.describe Pcaw::Base, type: :service do
  subject(:service) { service_class.new }

  describe 'GET service' do
    let(:service_class) do
      Class.new(described_class) do
        def url
          'http://stub'
        end

        def params
          { Key: '123-321' }
        end

        def execute!
          super
          assert { result['Items'] == [] }
        end

        def normalized_response
          response.data
        end
      end
    end

    describe '#execute' do
      let(:success_response) { double(body: "{\"Items\":[]}", code: 200) }
      let(:error_response) { double(body: {error: :some_error}.to_json, code: 400) }

      context 'when client gets valid response' do
        before do
          expect(RestClient).to receive(:get)
            .with('http://stub', params: { Key: '123-321' }, content_type: 'application/json')
            .and_return(success_response)
          service.execute
        end

        its(:response) { is_expected.to be_kind_of ApplicationService::RestMethods::Response }
        it { is_expected.to be_success }
      end

      context 'when raises rest client exception' do
        let(:error) { RestClient::BadRequest.new }
        before do
          allow(error).to receive(:response).and_return(error_response)
          expect(RestClient).to receive(:get).and_raise(error)
          allow(service).to receive(:request_error_message)
            .with(error, :get, instance_of(Array))
            .and_return('request error message')
        end

        it 'logs error' do
          expect(service).to receive(:log_request_error).with('request error message').and_call_original
          service.execute
        end

        it 'logs to airbrake' do
          expect(Airbrake).to receive(:notify)
          service.execute
        end

        it 'does not succeed' do
          service.execute
          is_expected.not_to be_success
        end
      end
    end
  end
end
