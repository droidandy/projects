require 'rails_helper'
require 'spec_helper'

RSpec.describe OneTransport::ClientLookup, type: :service do
  subject(:service) { described_class.new(company: company) }

  let(:company) { create(:company, :enterprise) }
  let(:params) do
    {
      client_number: company.ot_client_number,
      client_name: company.ot_username
    }
  end

  let(:savon_client) { double(operations: [:client_lookup]) }
  let(:response) do
    double(body: {
      client_lookup_response: {
        client_lookup_result: {
          header: {
            version: '3',
            software_version: 'One Transport General Webservices version 2.13.0.0',
            time: '2018-07-24T08:06:28+00:00',
            result: {
              message: nil,
              code: '0'
            }
          },
          general: {
            client_number: 'D25',
            client_name: 'DEMONSTRATIONS',
            references: nil,
            requirements: {
              requirements_structure: [
                {
                  ot_requirement_id: '001',
                  description: 'Wheelchair User (Ramps Required)'
                },
                {
                  ot_requirement_id: '002',
                  description: 'Ambulant Wheelchair User'
                }
              ]
            },
            journey_reasons: {
              journey_reason_structure: {
                label: 'Work to Home',
                journey_reason_type: 'WorkToHome'
              }
            },
            passenger_types: {
              passenger_type_structure: {
                name: 'Guest',
                type: 'Guest'
              }
            },
            vehicle_types: {
              vehicle_class_type_structure: {
                ot_internal_type_id: '0',
                v_class: 'Standard',
                v_type: 'Taxi',
                max_num_passengers: '5',
                max_num_luggage: '3',
                client_car_label: 'Black Taxi'
              }
            },
            preferred_vendor_reasons: {
              preferred_vendor_reason_structure: {
                id: '3',
                reason: 'Previous bad experience with other vendor(s)'
              }
            },
            job_charge_types: nil,
            out_of_policy_reasons: {
              out_of_policy_reason_structure: {
                id: '180',
                reason: 'No. of Passengers'
              }
            },
            disclaimer_names: nil
          }
        }
      }
    })
  end
  let(:request) do
    {
      header: {
        version:       4,
        key:           'TestKey',
        username:      'TestUsername',
        client_number: 'TestNumber',
        password:      'TestPassword',
        max_reply:     100
      },
      client_number: company.ot_client_number,
      client_name: company.ot_username
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
    allow(savon_client).to receive(:call).and_return(response)
  end

  describe '#execute' do
    before do
      expect(savon_client).to receive(:call)
        .with(:client_lookup, message: { request: request })
        .and_return(response)
      service.execute
    end

    it { is_expected.to be_success }
  end

  describe '#normalized_response' do
    let(:expected_response) do
      {
        requirements: [
          {
            key: '001',
            label: 'Wheelchair User (Ramps Required)'
          },
          {
            key: '002',
            label: 'Ambulant Wheelchair User'
          }
        ]
      }
    end

    before { service.execute }

    its(:normalized_response) { is_expected.to eq expected_response }
  end
end
