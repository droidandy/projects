require 'rails_helper'
require 'spec_helper'

RSpec.describe OneTransport::VehicleLocation, type: :service do
  subject(:service) { described_class.new(params) }

  service_context { { company: create(:company) } }

  let(:params) { { external_reference: 'AC95213' } }
  let(:location) do
    {
      latitude: '51.507762',
      longitude: '-0.075846',
      GRN: '169600',
      GRE: '533600',
      URN: '21752185'
    }
  end
  let(:response) do
    double(body: {
      vehicle_location_response: {
        vehicle_location_result: {
          header: {
            result: {
              code: '0',
              message: nil
            }
          },
          vehicle_availabilities: {
            vehicle_availabilty_structure: {
              distance_to_pickup_miles: "0",
              distance_to_pickup_km: "0",
              eta: will_arrive_at.strftime('%d/%m/%Y %H:%M:%S'),
              vehicle_state: 'Completed',
              location: location,
              vehicle: {
                vehicle_ref: 'V ZCL6X2',
                driver_ref: 'V ZCL6X2',
                reg_no: 'V ZCL6X2',
                make: nil,
                colour: nil,
                driver_name: 'Tony Carroll',
                description: 'SILVER VITO',
                vendor_name: 'Gett London',
                v_class: 'Standard',
                v_type: 'Taxi',
                driver_mobile_number: '123123123'
              }
            }
          }
        }
      }
    })
  end
  let(:savon_client) { double(operations: [:vehicle_location]) }
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
      o_t_confirmation_number: 'AC95213'
    }
  end
  let(:will_arrive_at) { Time.current + 90.minutes }

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
        .with(:vehicle_location, message: { request: request })
        .and_return(response)
      service.execute
    end

    it { is_expected.to be_success }
  end

  describe '#normalized_response' do
    subject { service.normalized_response }

    let(:expected_response) do
      {
        vehicle_state: 'Completed',
        driver: {
          name: 'Tony Carroll',
          phone_number: '123123123',
          vehicle: {
            model: 'SILVER VITO',
            license_plate: 'V ZCL6X2'
          },
          lat: '51.507762',
          lng: '-0.075846',
          eta: 30.0,
          vendor_name: "Gett London"
        }
      }
    end

    describe 'general case' do
      before { service.execute }
      it { is_expected.to eq expected_response }

      context 'with driver location (0, 0)' do
        let(:location) do
          {
            latitude: '0',
            longitude: '0',
            GRN: '0',
            GRE: '0',
            URN: '0'
          }
        end

        it { is_expected.to include :vehicle_state, :driver }
        its([:driver]) { is_expected.to include :name, :vehicle }
        its([:driver, :lat]) { is_expected.to be_nil }
        its([:driver, :lng]) { is_expected.to be_nil }
      end

      context 'with will_arrive_at in past' do
        let(:will_arrive_at) { Time.current - 30.minutes }

        its([:driver, :eta]) { is_expected.to eq 0 }
      end
    end

    describe 'special driver_name values' do
      before do
        response.body.dig(
          :vehicle_location_response,
          :vehicle_location_result,
          :vehicle_availabilities,
          :vehicle_availabilty_structure,
          :vehicle,
          :driver_name
        ).replace("GET-E Virtual Vehicle")

        service.execute
      end

      let(:expected_response) { super().deep_merge(driver: {name: "GET-E Virtual Vehicle", phone_number: '123123123'}) }

      it { is_expected.to eq expected_response }
    end
  end
end
