require 'rails_helper'

RSpec.describe GetE::Base, type: :service do
  subject(:service) { service_class.new }

  describe 'GET service' do
    let(:service_class) do
      Class.new(described_class) do
        http_method :get

        def url
          super('/foo')
        end

        def params
          { a: 1 }
        end
      end
    end

    describe '#execute' do
      let(:success_response) { double(body: {}, code: 200) }
      let(:error_response) { double(body: {error: :some_error}, code: 400) }

      context 'when client gets valid response' do
        before do
          expect(RestClient).to receive(:get)
            .with('https://localhost/foo', authorization: "X-Api-Key TestKey", params: { a: 1 })
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
          expect(Airbrake).to receive(:notify)
          expect(service).to receive(:log_request_error)
            .with('request error message')
            .and_call_original
          service.execute
        end

        it 'does not succeed' do
          service.execute
          is_expected.not_to be_success
        end
      end
    end
  end

  describe 'POST service' do
    let(:service_class) do
      Class.new(described_class) do
        http_method :post

        def url
          super('/bar')
        end

        def params
          { b: 2 }
        end
      end
    end

    describe '#execute' do
      let(:success_response) { double(body: {}, code: 200) }

      context 'when client gets valid response' do
        before do
          expect(RestClient).to receive(:post)
            .with('https://localhost/bar', { b: 2 }, { authorization: "X-Api-Key TestKey" })
            .and_return(success_response)
          service.execute
        end

        its(:response) { is_expected.to be_kind_of ApplicationService::RestMethods::Response }
        it { is_expected.to be_success }
      end
    end
  end

  describe 'PATCH service' do
    let(:service_class) do
      Class.new(described_class) do
        http_method :patch

        def url
          super('/bar')
        end

        def params
          { b: 2 }
        end
      end
    end

    describe '#execute' do
      let(:success_response) { double(body: {}, code: 200) }

      context 'when client gets valid response' do
        before do
          expect(RestClient).to receive(:patch)
            .with('https://localhost/bar', { b: 2 }, { authorization: "X-Api-Key TestKey" })
            .and_return(success_response)
          service.execute
        end

        its(:response) { is_expected.to be_kind_of ApplicationService::RestMethods::Response }
        it { is_expected.to be_success }
      end
    end
  end
end
