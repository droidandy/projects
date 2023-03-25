require 'rails_helper'
require 'savon'

RSpec.describe OneTransport::Base, type: :service do
  subject(:service) { service_class.new }

  service_context { { company: create(:company) } }

  let(:service_class) do
    class OneTransport::TestOneTransport < OneTransport::Base
      def options
        { a: 1 }
      end

      private def wsdl_url
        'http://localhost/ot'
      end
    end
  end
  let(:savon_client) { double(operations: [:test_one_transport]) }
  let(:header) do
    {
      version: 4,
      key: "TestKey",
      username: "TestUsername",
      client_number: "TestNumber",
      password: "TestPassword",
      max_reply: 1
    }
  end

  before do
    allow(Savon).to receive(:client)
      .with(
        wsdl: 'http://localhost/ot',
        element_form_default: :qualified,
        convert_request_keys_to: :camelcase
      )
      .and_return(savon_client)
  end

  describe '#execute' do
    context 'when method name is allowed' do
      let(:response) do
        double(body: {
          test_one_transport_response: {
            test_one_transport_result: {
              header: response_header
            }
          }
        })
      end

      before do
        allow(savon_client).to receive(:call)
          .with(:test_one_transport, message: { request: { header: header, a: 1 } })
          .and_return(response)
        expect(savon_client).not_to receive(:operation)
      end

      context 'when header of response with code 0' do
        let(:response_header) do
          {
            result: {
              code: '0',
              message: nil
            }
          }
        end

        it 'returns response with data' do
          service.execute
          expect(service.response.data).to eq(header: { result: { code: '0', message: nil } })
        end
      end

      context 'when header of response with error code' do
        let(:response_header) do
          {
            result: {
              code: '111',
              message: 'Some error message'
            }
          }
        end

        before do
          allow(service).to receive(:request_error_message)
            .with(:test_one_transport, message: { request: { header: header, a: 1 } })
            .and_return('request error message')
        end

        it 'logs error' do
          expect(service).to receive(:log_request_error).with('request error message')
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
        .with(:test_one_transport).and_return(savon_operation)
      expect(savon_operation).to receive(:build)
        .with(message: { request: { header: header, a: 1 } })
        .and_return(double(to_s: 'result string'))
      expect(savon_client).not_to receive(:call)
    end

    its(:to_xml_string) { is_expected.to eq 'result string' }
  end

  describe '#booker' do
    subject(:booker) { service.send(:booker) }

    let(:savon_client) { double(operations: [:profile_lookup]) }
    let(:response) do
      double(body: {
        profile_lookup_response: {
          profile_lookup_result: {
            header: {
              result: {
                code: '0',
                message: nil
              }
            },
            profile: {
              general: {
                person_id: '123',
                username: 'Username',
                title: 'Mr',
                first_name: 'First',
                last_name: 'Last',
                email: 'mail@example.com'
              }
            }
          }
        }
      })
    end
    let(:booker_data) do
      {
        person_ID: '123',
        username: 'Username',
        title: 'Mr',
        first_name: 'First',
        last_name: 'Last',
        email: 'mail@example.com',
        mobile_phone: '',
        work_phone: '',
        role: '',
        stuff_number: '',
        passenger_type: {
          name: '',
          type: 'None'
        }
      }
    end

    context 'when ProfileLookup succeeds' do
      before do
        allow(savon_client).to receive(:call)
          .with(:profile_lookup, message: {
            request: {
              header: header,
              username: 'TestUsername',
              client_number: 'TestNumber'
            }
          })
          .and_return(response)
      end

      it { is_expected.to eq booker_data }

      it 'does not call API twice' do
        2.times { service.send(:booker) }
        expect(savon_client).to have_received(:call).with(:profile_lookup, hash_including(:message)).once
      end
    end

    context 'when ProfileLookup fails' do
      before do
        described_class.remove_class_variable(:@@booker) if described_class.class_variable_defined?(:@@booker)
        allow(savon_client).to receive(:call).and_raise(StandardError.new('Error'))
      end

      it 'raises exception' do
        expect{ service.send(:booker) }.to raise_error('Fetching booker info failed')
      end
    end
  end
end
