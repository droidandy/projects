require 'rails_helper'
require 'savon'

RSpec.describe Carey::Base, type: :service do
  subject(:service) { service_class.new }

  let(:service_class) do
    Class.new(Carey::Base) do
      def options
        { a: 1 }
      end

      private def wsdl_url
        'http://localhost/carey'
      end

      private def soap_method
        :test_carey
      end

      private def response_class
        Carey::Response
      end
    end
  end

  let(:savon_client) { double(operations: [:test_carey]) }

  before do
    allow(Savon).to receive(:client)
      .with(
        wsdl: 'http://localhost/carey',
        element_form_default: :qualified,
        convert_request_keys_to: :camelcase,
        headers: {
          app_id: 'AppId',
          app_key: 'AppKey',
          'X-SOAP-Method': 'testCarey'
        }
      )
      .and_return(savon_client)
    allow_any_instance_of(Carey::Response).to receive(:response_method).and_return(:test_carey_rs)
  end

  describe '#execute' do
    context 'when method name is allowed' do
      let(:response) do
        double(body: {
          test_carey_rs: {
            a: 1
          }
        })
      end

      before do
        allow(savon_client).to receive(:call)
          .with(:test_carey, message: { a: 1 })
          .and_return(response)
        expect(savon_client).not_to receive(:operation)
      end

      context 'when response without error' do
        it 'returns response with data' do
          service.execute
          expect(service.response.data).to eq(a: 1)
        end

        it 'succeeds' do
          service.execute
          is_expected.to be_success
        end
      end

      context 'when header of response with error code' do
        let(:response) do
          double(body: {
            test_carey_rs: {
              errors: {
                error: 'Some error message'
              }
            }
          })
        end

        it 'logs error' do
          expect(service).to receive(:log_request_error)
            .with("SoapClient::ErrorWithResponse - Some error message while processing request 'test_carey' with message {:message=>{:a=>1}}")
          service.execute
        end

        it 'does not succeed' do
          service.execute
          is_expected.not_to be_success
        end
      end
    end

    context 'when method name is not allowed' do
      let(:savon_client) { double(operations: []) }

      before { service.execute }

      it 'does not return response' do
        expect(service.response).to be_nil
      end
    end
  end

  describe '#to_xml_string' do
    let(:savon_operation) { double }

    before do
      expect(savon_client).to receive(:operation)
        .with(:test_carey).and_return(savon_operation)
      expect(savon_operation).to receive(:build)
        .with(message: { a: 1 })
        .and_return(double(to_s: 'result string'))
      expect(savon_client).not_to receive(:call)
    end

    its(:to_xml_string) { is_expected.to eq 'result string' }
  end
end
