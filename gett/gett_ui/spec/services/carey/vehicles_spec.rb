require 'rails_helper'
require 'spec_helper'

RSpec.describe Carey::Vehicles, type: :service do
  before { allow(Currencies::Converter).to receive_message_chain(:new, :execute, :result).and_return(500) }

  subject(:service) { described_class.new(attrs: params, allowed_services: [:carey]) }

  service_context { { company: company } }

  let(:params) do
    {
      pickup_address: {
        postal_code: 'NW11 9UA',
        lat: '51.5766877',
        lng: '-0.2156368',
        line: 'Queens Zoo, 53-51 111th Street Flushing, Queens, NY 11368, USA',
        country_code: 'GB'
      },
      destination_address: {
        postal_code: 'HA8 6EY',
        lat: '51.6069082',
        lng: '-0.2816665',
        line: 'ibis Styles New York LaGuardia Airport, 100-33 Ditmars Blvd, Queens, NY 11369, USA',
        country_code: 'GB'
      },
      scheduled_at: scheduled_at,
      passenger_id: passenger.id.to_s,
      international: false,
      later: later
    }
  end
  let(:response) do
    double(body: {
      ota_ground_avail_rs:
        {
          ground_services:
          {
            ground_service:
            [
              {
                service:
                {
                  service_level: {:@code => "Premium"},
                  vehicle_make_model: {:@name => "LS03"},
                  :@notes => "AsDirected"
                },
                shuttle: { vehicle: { type: "Luxury Sedan" } },
                total_charge: { :@rate_total_amount => "291.64" }
              },
              {
                service:
                {
                  :service_level => {:@code => "Premium"},
                  :vehicle_make_model => {:@name => "ES03"},
                  :@notes => "AsDirected"
                },
                shuttle: { vehicle: { type: "Executive Sedan" } },
                total_charge: { :@rate_total_amount => "245.60"}
              },
              {
                service:
                {
                  :service_level => {:@code => "Premium"},
                  :vehicle_make_model => {:@name => "SU04"},
                  :@notes => "AsDirected"
                },
                shuttle: { vehicle: { type: "Sport Utility Vehicle" } },
                total_charge: { :@rate_total_amount => "300.00"}
              }
            ]
          }
        }
    })
  end
  let(:company) { create(:company) }
  let(:passenger) { create(:passenger, company: company) }
  let(:savon_client) { double(operations: [:rate_inquiry]) }
  let(:message) do
    {
      POS: {
        Source: {
          RequestorID: {
            :@MessagePassword => "TestPassword",
            :@ID => "test@test.test",
            :@Type => "TA"
          },
          BookingChannel: {
            content!: {
              CompanyName: {
                content!: "TestCompanyFullName",
                :@Code => "AppKey",
                :@CompanyShortName => "TestCompany",
                :@CodeContext => "TestContext"
              }
            },
            :@Type => "TA"
          }
        }
      },
      Service: {
        Pickup: {
          :content! => {
            Address: {
              :content! => {
                AddressLine: "Queens Zoo, 53-51 111th Street",
                CityName: nil,
                PostalCode: "NW11 9UA",
                CountryName: {
                  :@Code => "GB"
                }
              },
              :@Latitude => "51.5766877",
              :@Longitude => "-0.2156368"
            }
          },
          :@DateTime => scheduled_at.strftime('%Y-%m-%dT%H:%M:%S')
        },
        Dropoff: {
          content!: {
            Address: {
              :content! => {
                AddressLine: "ibis Styles New York LaGuardia",
                CityName: nil,
                PostalCode: "HA8 6EY",
                CountryName: {
                  :@Code => "GB"
                }
              },
              :@Latitude => "51.6069082",
              :@Longitude => "-0.2816665"
            }
          }
        }
      },
      ServiceType: {
        :@Code => 'Point-To-Point',
        :@Description => "Premium"
      },
      VehiclePrefs: [
        {
          Type: {
            :@Code => "LS03"
          }
        },
        {
          Type: {
            :@Code => "ES03"
          }
        },
        {
          Type: {
            :@Code => "SU04"
          }
        }
      ],
      RateQualifier: {
        :@AccountID => "TestAccountId"
      }
    }
  end
  let(:scheduled_at) { 2.hours.from_now }
  let(:later) { true }

  before do
    allow(Savon).to receive(:client)
      .with(
        wsdl: 'http://localhost',
        element_form_default: :qualified,
        convert_request_keys_to: :camelcase,
        headers: {
          app_id: 'AppId',
          app_key: 'AppKey',
          'X-SOAP-Method': 'rateInquiry'
        }
      )
      .and_return(savon_client)
    allow(savon_client).to receive(:call).and_return(response)
  end

  describe '#execute' do
    it 'calls API' do
      expect(savon_client).to receive(:call).with(:rate_inquiry, message: message).and_return(response)

      expect(service.execute).to be_success
    end

    context 'when airport data is present' do
      let(:params) do
        super().deep_merge(
          pickup_address: {
            line: 'Dublin Airport, Dublin, Ireland',
            airport_iata: 'DUB'
          },
          flight: 'BA5957'
        )
      end

      let(:message) do
        super().tap do |msg|
          msg[:Service][:Pickup].replace(
            AirportInfo: {
              Arrival: {
                :@AirportName => 'Dublin Airport',
                :@LocationCode => 'DUB'
              }
            },
            :@DateTime => scheduled_at.strftime('%Y-%m-%dT%H:%M:%S')
          )
        end
      end

      it 'calls API with airport data in the message' do
        expect(savon_client).to receive(:call).with(:rate_inquiry, message: message).and_return(response)

        expect(service.execute).to be_success
      end
    end
  end

  describe '#can_execute?' do
    context 'when cannot execute' do
      its(:can_execute?) { is_expected.to be true }

      context 'when allowed_services does not include carey' do
        subject(:service) { described_class.new(attrs: params, allowed_services: []) }
        its(:can_execute?) { is_expected.to be false }
      end

      context 'when asap booking' do
        let(:later) { false }
        its(:can_execute?) { is_expected.to be false }
      end
    end
  end

  describe '#normalized_response' do
    let(:expected_response) do
      {
        vehicles: [
          {
            name: "Luxury Sedan",
            code: "LS03",
            service_category: "Premium",
            price: "291.64"
          },
          {
            name: "Executive Sedan",
            code: "ES03",
            service_category: "Premium",
            price: "245.60"
          },
          {
            name: "Sport Utility Vehicle",
            code: "SU04",
            service_category: "Premium",
            price: "300.00"
          }
        ]
      }
    end

    before { service.execute }
    its(:normalized_response) { is_expected.to eq expected_response }
  end

  describe '#as_vehicles' do
    let(:expected_response) do
      [
        {
          value: "LS03",
          name: "Chauffeur",
          price: 50000,
          quote_id: "LS03",
          supports_driver_message: true,
          supports_flight_number: true
        },
        {
          value: "ES03",
          name: "Chauffeur",
          price: 50000,
          quote_id: "ES03",
          supports_driver_message: true,
          supports_flight_number: true
        },
        {
          value: "SU04",
          name: "Chauffeur",
          price: 50000,
          quote_id: "SU04",
          supports_driver_message: true,
          supports_flight_number: true
        }
      ]
    end

    before { service.execute }
    its(:as_vehicles) { is_expected.to eq expected_response }
  end
end
