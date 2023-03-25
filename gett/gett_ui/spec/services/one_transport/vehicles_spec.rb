require 'rails_helper'
require 'spec_helper'

RSpec.describe OneTransport::Vehicles, type: :service do
  subject(:service) { described_class.new(attrs: params, allowed_services: [:ot]) }

  service_context { { company: create(:company) } }

  let(:params) do
    {
      pickup_address: {
        postal_code: 'NW11 9UA',
        lat: '51.5766877',
        lng: '-0.2156368',
        line: '3 Station Approach Highfield Avenue London',
        country_code: 'GB'
      },
      destination_address: {
        postal_code: 'HA8 6EY',
        lat: '51.6069082',
        lng: '-0.2816665',
        line: '1 Milford Gardens Edgware',
        country_code: 'GB'
      },
      scheduled_at: scheduled_at,
      passenger_name: 'Hosea Tillman', passenger_phone: '+7999888776655',
      international: international
    }
  end
  let(:response) do
    double(body: {
      job_quote_response: {
        job_quote_result: {
          header: {
            result: {
              code: '0',
              message: nil
            }
          },
          general: {
            quote_id: "30248",
            quote_type: "Fixed"
          },
          quotes: [{
            quote_structure: [
              {
                option_id: "1",
                charges: {
                  charge_structure: [
                    { amount: "988", decimal_places: "2", currency: "Miles", charge_sequence: "1", charge_type: "NONE", charge_name: "MILEAGE" },
                    { amount: "990", decimal_places: "2", currency: "Miles", charge_sequence: "2", charge_type: "NONE", charge_name: "CHARGEABLE_MILEAGE" },
                    { amount: "2866", decimal_places: "2", currency: "GBP", charge_sequence: "3", charge_type: "FIXED", charge_name: "FARE_QUOTE" },
                    { amount: "190", decimal_places: "2", currency: "GBP", charge_sequence: "4", charge_type: "FIXED", charge_name: "JMF" },
                    { amount: "0", decimal_places: "2", currency: "GBP", charge_sequence: "5", charge_type: "FIXED", charge_name: "CARD_SERVICE" },
                    { amount: "0", decimal_places: "2", currency: "GBP", charge_sequence: "6", charge_type: "FIXED", charge_name: "TRANSACTION" },
                    { amount: "3056", decimal_places: "2", currency: "GBP", charge_sequence: "7", charge_type: "FIXED", charge_name: "TOTAL_QUOTE" },
                    { amount: "3667", decimal_places: "2", currency: "GBP", charge_sequence: "8", charge_type: "FIXED", charge_name: "TOTAL_QUOTE_INC_VAT" },
                    { amount: "0", decimal_places: "0", currency: "GBP", charge_sequence: "9", charge_type: "Estimated", charge_name: "CHARGE_STATUS" }
                  ]
                },
                quote_type: "Estimate",
                vehicle_type: "Saloon",
                vehicle_class: "Standard",
                max_num_passengers: "3",
                distance_meters: "15899",
                calculate_type: "None",
                eta: "52"
              },
              {
                option_id: "2",
                charges: {
                  charge_structure: [
                    { amount: "11937", decimal_places: "2", currency: "Miles", charge_sequence: "1", charge_type: "NONE", charge_name: "MILEAGE" },
                    { amount: "11940", decimal_places: "2", currency: "Miles", charge_sequence: "2", charge_type: "NONE", charge_name: "CHARGEABLE_MILEAGE" },
                    { amount: "35374", decimal_places: "2", currency: "GBP", charge_sequence: "3", charge_type: "FIXED", charge_name: "FARE_QUOTE" },
                    { amount: "190", decimal_places: "2", currency: "GBP", charge_sequence: "4", charge_type: "FIXED", charge_name: "JMF" },
                    { amount: "0", decimal_places: "2", currency: "GBP", charge_sequence: "5", charge_type: "FIXED", charge_name: "CARD_SERVICE" },
                    { amount: "0", decimal_places: "2", currency: "GBP", charge_sequence: "6", charge_type: "FIXED", charge_name: "TRANSACTION" },
                    { amount: "35564", decimal_places: "2", currency: "GBP", charge_sequence: "7", charge_type: "FIXED", charge_name: "TOTAL_QUOTE" },
                    { amount: "42677", decimal_places: "2", currency: "GBP", charge_sequence: "8", charge_type: "FIXED", charge_name: "TOTAL_QUOTE_INC_VAT" },
                    { amount: "0", decimal_places: "0", currency: "GBP", charge_sequence: "9", charge_type: "Estimated", charge_name: "CHARGE_STATUS" }
                  ]
                },
                quote_type: "Estimate",
                vehicle_type: "MPV",
                vehicle_class: "Standard",
                max_num_passengers: "6",
                distance_meters: "192098",
                calculate_type: "None",
                eta: "236"
              }
            ]
          }]
        }
      }
    })
  end
  let(:savon_client) { double(operations: [:job_quote]) }
  let(:request) do
    {
      header: {
        version:       4,
        key:           "TestKey",
        username:      "TestUsername",
        client_number: "TestNumber",
        password:      "TestPassword",
        max_reply:     10
      },
      general: {
        quote_type: 'Fixed',
        client: {
          client_number: 'TestNumber',
          client_name:   ''
        },
        flags: {
          wait_and_return: false,
          journey_reason:  'Work to Home',
          num_passengers:  1,
          origin:          'Web',
          job_charge_type: 'Fixed'
        }
      },
      stops: {
        stop_structure: [
          {
            stop_ID: 0,
            address_details: {
              address: {
                building_name: '',
                business_name: '',
                apartment:     '',
                street_number: '',
                street_name:   '3 Station Approach Highfield Avenue London',
                dst:           '',
                town:          '',
                country:       'GB',
                postcode:      'NW11 9UA'
              },
              location: {
                latitude: '51.5766877',
                longitude: '-0.2156368'
              }
            },
            passengers: {
              passenger_structure: {
                person: {
                  passenger_type: {
                    name: 'Guest',
                    type: 'Guest'
                  },
                  title:                '',
                  first_name:           'Hosea',
                  last_name:            'Tillman',
                  mobile_phone:         '7999888776655',
                  home_phone:           '7999888776655',
                  work_phone:           '7999888776655',
                  email:                '',
                  notification:         '',
                  client_number:        '',
                  staff_number:         '',
                  role:                 '',
                  special_requirements: '',
                  flags:                ''
                },
                action: 'Pickup'
              }
            },
            stop_notes:         '',
            required_date_time: scheduled_at,
            as_directed:        false
          },
          {
            stop_ID: 1,
            address_details: {
              address: {
                building_name: '',
                business_name: '',
                apartment:     '',
                street_number: '',
                street_name:   '1 Milford Gardens Edgware',
                dst:           '',
                town:          '',
                country:       'GB',
                postcode:      'HA8 6EY'
              },
              location: {
                latitude: '51.6069082',
                longitude: '-0.2816665'
              }
            },
            passengers: {
              passenger_structure: {
                person: {
                  passenger_type: {
                    name: 'Guest',
                    type: 'Guest'
                  },
                  title:                '',
                  first_name:           'Hosea',
                  last_name:            'Tillman',
                  mobile_phone:         '7999888776655',
                  home_phone:           '7999888776655',
                  work_phone:           '7999888776655',
                  email:                '',
                  notification:         '',
                  client_number:        '',
                  staff_number:         '',
                  role:                 '',
                  special_requirements: '',
                  flags:                ''
                },
                action: 'Setdown'
              }
            },
            stop_notes:         '',
            required_date_time: scheduled_at,
            as_directed:        false
          }
        ]
      }
    }
  end
  let(:scheduled_at) { Time.current + 5.minutes }
  let(:international) { false }

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
        .with(:job_quote, message: { request: request })
        .and_return(response)
      service.execute
    end

    it { is_expected.to be_success }
  end

  describe '#normalized_response' do
    let(:expected_response) do
      {
        quote_id: "30248",
        quotes: [
          {
            vehicle_type: "Saloon",
            vehicle_class: "Standard",
            charge: "2866"
          },
          {
            vehicle_type: "MPV",
            vehicle_class: "Standard",
            charge: "35374"
          }
        ]
      }
    end

    before { service.execute }
    its(:normalized_response) { is_expected.to eq expected_response }
  end

  describe '#as_vehicles' do
    before { service.execute }

    let(:expected_response) do
      [
        {
          value: "Saloon_Standard",
          name: "Standard",
          price: 2866.0,
          quote_id: "30248",
          supports_driver_message: true,
          supports_flight_number: true
        },
        {
          value: "MPV_Standard",
          name: "MPV",
          price: 35374.0,
          quote_id: "30248",
          supports_driver_message: true,
          supports_flight_number: true
        }
      ]
    end

    its(:as_vehicles) { is_expected.to eq expected_response }
  end

  describe '#can_execute?' do
    context 'when cannot execute' do
      its(:can_execute?) { is_expected.to be true }

      context 'when allowed_services does not include carey' do
        subject(:service) { described_class.new(attrs: params, allowed_services: []) }
        its(:can_execute?) { is_expected.to be false }
      end
    end
  end
end
