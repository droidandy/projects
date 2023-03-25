require 'rails_helper'
require 'spec_helper'

RSpec.describe OneTransport::Modify, type: :service do
  before { Timecop.freeze }
  after  { Timecop.return }

  subject(:service) { described_class.new(booking: booking) }

  service_context { { company: booking.booker.company } }

  let(:booking) do
    create(:booking,
      vehicle: create(:vehicle, :one_transport),
      quote_id: 'quote1',
      ot_confirmation_number: 'AC11111',
      scheduled_at: 2.hours.from_now,
      passenger: create(:passenger, phone: '+1231231231')
    )
  end
  let(:stop_address) { create(:address) }
  let(:response) do
    double(body: {
      job_modify_response: {
        job_modify_result: {
          header: {
            result: {
              code: '0',
              message: nil
            }
          },
          job: {
            general: {
              ot_confirmation_number: "1000293486",
              state: "None",
              external_reference: "AC93511",
              quote_id: "30248",
              amount: "26.25"
            }
          },
          costs: {
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
            }
          }
        }
      }
    })
  end
  let(:savon_client) { double(operations: [:job_modify]) }
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
      job: {
        general: {
          OT_confirmation_number: 'AC11111',
          state: 'None',
          client: {
            client_number: 'TestNumber',
            client_name:   ''
          },
          external_reference: 'service-id',
          quote_ID:           '',
          activation_code:    '',
          payment_reference: {
            payment_method: {
              payment_name: '',
              payment_ID:   'Account',
              payment_type: 'Client',
              client: {
                client_number: 'TestNumber',
                client_name:   ''
              }
            },
            amount: 0.0,
            notes:  ''
          },
          booker: {
            person_ID:  '123',
            username:   'Username',
            title:      'Mr',
            first_name: 'First',
            last_name:  'Last',
            email:      'mail@example.com'
          },
          job_flags: {
            job_requirements: [],
            wait_and_return:  0,
            vehicle_type:     'Saloon',
            vehicle_class:    'Standard',
            journey_reason:   'Work to Home',
            num_passengers:   1,
            origin:           'Web',
            job_charge_type:  'None',
            asap:             false,
            share:            false
          },
          date: booking.scheduled_at
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
                  street_name:   booking.pickup_address.line,
                  dst:           '',
                  town:          '',
                  country:       booking.pickup_address.country_code,
                  postcode:      booking.pickup_address.postal_code
                },
                location: {
                  latitude:  booking.pickup_address.lat,
                  longitude: booking.pickup_address.lng
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
                    first_name:           booking.passenger.first_name,
                    last_name:            booking.passenger.last_name,
                    mobile_phone:         '1231231231',
                    home_phone:           '1231231231',
                    work_phone:           '1231231231',
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
              stop_notes:         'Some message',
              required_date_time: booking.scheduled_at,
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
                  street_name:   stop_address.line,
                  dst:           '',
                  town:          '',
                  country:       stop_address.country_code,
                  postcode:      stop_address.postal_code
                },
                location: {
                  latitude:  stop_address.lat,
                  longitude: stop_address.lng
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
                    first_name:           'Bob',
                    last_name:            '',
                    mobile_phone:         '79998887766',
                    home_phone:           '79998887766',
                    work_phone:           '79998887766',
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
              required_date_time: booking.scheduled_at,
              as_directed:        false
            },
            {
              stop_ID: 2,
              address_details: {
                address: {
                  building_name: '',
                  business_name: '',
                  apartment:     '',
                  street_number: '',
                  street_name:   booking.destination_address.line,
                  dst:           '',
                  town:          '',
                  country:       booking.destination_address.country_code,
                  postcode:      booking.destination_address.postal_code
                },
                location: {
                  latitude:  booking.destination_address.lat,
                  longitude: booking.destination_address.lng
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
                    first_name:           booking.passenger.first_name,
                    last_name:            booking.passenger.last_name,
                    mobile_phone:         '1231231231',
                    home_phone:           '1231231231',
                    work_phone:           '1231231231',
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
              required_date_time: booking.scheduled_at,
              as_directed:        false
            }
          ]
        }
      }
    }
  end

  before do
    booking.add_booking_address(
      address_id: stop_address.id,
      address_type: 'stop',
      stop_info: { name: 'Bob', phone: '+79998887766' }
    )

    allow(Savon).to receive(:client)
      .with(
        wsdl: 'http://localhost/ot',
        element_form_default: :qualified,
        convert_request_keys_to: :camelcase
      )
      .and_return(savon_client)
    allow(service).to receive(:booker).and_return(
      person_ID: '123',
      username: 'Username',
      title: 'Mr',
      first_name: 'First',
      last_name: 'Last',
      email: 'mail@example.com'
    )
    allow(savon_client).to receive(:call).and_return(response)
  end

  describe '#execute' do
    before do
      expect(savon_client).to receive(:call)
        .with(:job_modify, message: { request: request })
        .and_return(response)
      service.execute
    end

    it { is_expected.to be_success }
  end

  describe '#normalized_response' do
    let(:expected_response) do
      {
        ot_confirmation_number: '1000293486',
        service_id: 'AC93511',
        fare_quote: 35374
      }
    end
    let(:company) do
      create :company,
        booking_fee:  2.0,
        run_in_fee:   3.0,
        handling_fee: 4.0,
        tips:         5.0
    end

    service_context { { company: company } }

    before { service.execute }
    its(:normalized_response) { is_expected.to eq expected_response }
  end
end
