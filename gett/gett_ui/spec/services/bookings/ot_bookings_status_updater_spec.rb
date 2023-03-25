require 'rails_helper'

RSpec.describe Bookings::OTBookingsStatusUpdater, type: :service do
  let(:vehicle)  { create(:vehicle, :one_transport) }
  let!(:booking) { create(:booking, :without_passenger, vehicle: vehicle, service_id: 'AC94868', quote_id: '31460', ot_confirmation_number: '1000294813') }

  subject(:service) { described_class.new(external_references: ['AC94868']) }

  describe '#execute' do
    let(:savon_client) { double(operations: [:job_status]) }
    let(:request) do
      {
        header: {
          version:       4,
          key:           "TestKey",
          username:      "TestUsername",
          client_number: "TestNumber",
          password:      "TestPassword",
          max_reply:     1
        },
        external_references: [{ 'string' => 'AC94868' }]
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
      allow(savon_client).to receive(:call)
        .with(:job_status, message: { request: request })
        .and_return(response)
    end

    context 'when response status is Prebooked' do
      let(:response) do
        double(body: {
          job_status_response: {
            job_status_result: {
              header: {
                result: {
                  code: '0',
                  message: nil
                }
              },
              job_states: {
                job_status_structure: [
                  {
                    ot_confirmation_number: "1000294829",
                    external_reference: "AC94868",
                    job_state: "Prebooked",
                    job_charge_state: "Estimated",
                    vendor_id: "",
                    vendor_name: "",
                    charges: {
                      charges: "",
                      vehicle_type: "None",
                      vehicle_class: "None",
                      max_num_passengers: 0,
                      distance_meters: 0,
                      calculate_type: "None"
                    }
                  },
                  {
                    ot_confirmation_number: "1000294813",
                    external_reference: "AC94852",
                    job_state: "Prebooked",
                    job_charge_state: "Estimated",
                    vendor_id: "",
                    vendor_name: "",
                    charges: {
                      charges: "",
                      vehicle_type: "None",
                      vehicle_class: "None",
                      max_num_passengers: 0,
                      distance_meters: 0,
                      calculate_type: "None"
                    }
                  }
                ]
              }
            }
          }
        })
      end

      it 'does not update status but add status to ride info' do
        expect{ service.execute }.not_to change{ booking.reload.status }
        expect(booking.ot_job_status).to eq('Prebooked')
      end
    end

    context 'when response does not have statuses' do
      let(:response) do
        double(body: {
          job_status_response: {
            job_status_result: {
              header: {
                result: {
                  code: '0',
                  message: nil
                }
              },
              job_states: nil
            }
          }
        })
      end

      it 'does not update status and does not add ride info' do
        expect{ service.execute }.not_to change{ booking.reload.status }
        expect(booking.driver).to be_nil
      end
    end
  end
end
