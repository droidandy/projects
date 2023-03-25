require 'rails_helper'
require 'spec_helper'

RSpec.describe Carey::Create, type: :service do
  before { allow(Currencies::Converter).to receive_message_chain(:new, :execute, :result).and_return(500) }

  before { Timecop.freeze('2018-07-17 12:00:00'.to_datetime) }
  after  { Timecop.return }

  subject(:service) { described_class.new(booking: booking) }

  let(:booking) do
    create(:booking, :carey,
      pickup_address:      pickup_address,
      destination_address: destination_address,
      scheduled_at:        2.hours.from_now,
      service_id:          'ES03',
      stop_addresses:      [stop_address],
      flight:              flight
    )
  end
  let(:pickup_address)      { create(:address, country_code: 'US', timezone: 'America/New_York') }
  let(:destination_address) { create(:address) }
  let(:stop_address)        { create(:address) }
  let(:flight)              { nil }
  let(:reservation_data) do
    {
      reservation: {
        confirmation: { :@id => "WA10701683-1" },
        total_charge: { :@rate_total_amount => "245.60" }
      }
    }
  end
  let(:response) do
    double(body: { ota_ground_book_rs: reservation_data })
  end

  let(:savon_client) { double(operations: [:add_reservation]) }

  let(:pos_structure) do
    {
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
    }
  end

  let(:pickup_structure) do
    {
      content!: {
        Address: {
          content!: {
            AddressLine: booking.pickup_address[:line].slice(0, 30),
            CityName:  booking.pickup_address[:city],
            PostalCode:  booking.pickup_address[:postal_code],
            CountryName: {
              :@Code => booking.pickup_address.country_code
            }
          },
          :@Latitude => booking.pickup_address.lat.to_s,
          :@Longitude => booking.pickup_address.lng.to_s
        }
      },
      :@DateTime => booking.scheduled_at.in_time_zone(booking.timezone).to_datetime.strftime('%Y-%m-%dT%H:%M:%S')
    }
  end

  let(:dropoff_structure) do
    {
      content!: {
        Address: {
          content!: {
            AddressLine: booking.destination_address[:line].slice(0, 30),
            CityName:  booking.destination_address[:city],
            PostalCode:  booking.destination_address[:postal_code],
            CountryName: {
              :@Code => booking.destination_address.country_code
            }
          },
          :@Latitude => booking.destination_address.lat.to_s,
          :@Longitude => booking.destination_address.lng.to_s
        }
      }
    }
  end

  let(:stop_structure) do
    {
      Address: {
        content!: {
          AddressLine: booking.stop_addresses.first[:line].slice(0, 30),
          CityName:  booking.stop_addresses.first[:city],
          PostalCode:  booking.stop_addresses.first[:postal_code],
          CountryName: {
            :@Code => booking.stop_addresses.first.country_code
          }
        },
        :@Latitude => booking.stop_addresses.first.lat.to_s,
        :@Longitude => booking.stop_addresses.first.lng.to_s
      }
    }
  end

  let(:options_structure) do
    {
      POS: pos_structure,
      GroundReservation: {
        Location: {
          Pickup: pickup_structure,
          Dropoff: dropoff_structure,
          Stops: { Stop: [{ content!: stop_structure }] }
        },
        Passenger: passenger_structure,
        Service: {
          ServiceLevel: {
            :@Code => "Point-To-Point",
            :@Description => "Premium"
          },
          VehicleType: {
            :@Code => booking.quote_id
          }
        },
        RateQualifier: {
          :@AccountID => "TestAccountId",
          :SpecialInputs => {
            :@Name  => 'OT Order ID',
            :@Value => booking.id
          }
        }
      }
    }
  end

  let(:passenger_structure) do
    {
      Primary: {
        PersonName: {
          GivenName: first_name,
          Surname:   last_name
        },
        Telephone: {
          :@PhoneNumber       => phone_number,
          :@PhoneUseType      => "1",
          :@CountryAccessCode => country_access_code
        },
        Email: email
      }
    }
  end

  let(:first_name)          { booking.passenger.first_name }
  let(:last_name)           { booking.passenger.last_name }
  let(:phone_number)        { '995555555' }
  let(:country_access_code) { '380' }
  let(:email)               { booking.passenger.email }

  before do
    allow(Savon).to receive(:client)
      .with(
        wsdl: 'http://localhost',
        element_form_default: :qualified,
        convert_request_keys_to: :camelcase,
        headers: {
          app_id: 'AppId',
          app_key: 'AppKey',
          'X-SOAP-Method': 'addReservation'
        }
      )
      .and_return(savon_client)
    allow(savon_client).to receive(:call).and_return(response)
    allow(service).to receive(:sequence_number).and_return('12345')
  end

  describe '#execute' do
    before do
      expect(savon_client).to receive(:call)
        .with(:add_reservation, message: options_structure, attributes: { SequenceNmbr: '12345' })
        .and_return(response)
      service.execute
    end

    it { is_expected.to be_success }
  end

  describe '#normalized_response' do
    let(:expected_response) do
      {
        service_id: 'WA10701683-1',
        fare_quote: 50000
      }
    end

    before { service.execute }
    its(:normalized_response) { is_expected.to eq expected_response }
  end

  describe '#options' do
    subject(:options){ service.send(:options) }

    let(:airport) { create(:airport, iata: 'JFK', name: 'JFK Airport') }

    context 'when pickup and dropoff are addresses' do
      # default pickup and dropoff defined as addresses
      it { is_expected.to eq(options_structure) }
    end

    context 'when there is guest user' do
      let(:booking) do
        create(:booking,
          :carey,
          :without_passenger,
          passenger_first_name: first_name,
          passenger_last_name:  last_name,
          passenger_phone:      original_phone_number,
          pickup_address:       pickup_address,
          destination_address:  destination_address,
          scheduled_at:         2.hours.from_now,
          service_id:           'ES03',
          stop_addresses:       [stop_address],
          flight:               flight
        )
      end

      let(:first_name)            { 'Sergey' }
      let(:last_name)             { 'Berdnikovich' }
      let(:original_phone_number) { '+375293206444' }
      let(:phone_number)          { '293206444' }
      let(:email)                 { '375293206444@gett.com' }
      let(:country_access_code)   { '375' }

      it 'builds email from phone number' do
        expect(options).to eq(options_structure)
      end

      context 'when there is incorrect phone number' do
        let(:original_phone_number) { '+34123123123123' }
        let(:phone_number)          { '34123123123123' }
        let(:country_access_code)   { '1' }
        let(:email)                 { '34123123123123@gett.com' }

        it 'uses original phone number and default country access code' do
          expect(options).to eq(options_structure)
        end
      end
    end

    context 'when pickup is airport' do
      let(:pickup_address) { create(:address, timezone: 'America/New_York', country_code: 'US') }
      let(:flight) { 'AA978' }

      let(:pickup_structure) do
        {
          AirportInfo: {
            Arrival: {
              :@AirportName => 'JFK Airport',
              :@LocationCode => 'JFK',
              :@Terminal => '8'
            }
          },
          Airline: {
            :@FlightDateTime => "2018-07-17T19:26:00.000", # obtained from Flightstats response
            :@FlightNumber => "978",
            :@Code => "AA"
          },
          :@DateTime => '2018-07-17T10:00:00' # booking's scheduled_at in New York's timezone
        }
      end

      before { stub_api! }

      it 'should return airport as pickup' do
        booking.pickup_address.update(airport_id: airport.id)
        expect(options).to eq(options_structure)
      end
    end

    context 'when dropoff is airport' do
      let(:destination_address) { create(:address, timezone: 'America/New_York') }
      let(:flight) { 'AA978' }

      let(:dropoff_structure) do
        {
          AirportInfo: {
            Departure: {
              :@AirportName => 'JFK Airport',
              :@LocationCode => 'JFK',
              :@Terminal => '8'
            }
          },
          Airline: {
            :@FlightDateTime => "2018-07-17T09:30:00.000", # obtained from Flightstats response
            :@FlightNumber => "978",
            :@Code => "AA"
          }
        }
      end

      before { stub_api! }

      it 'should return airport as dropoff' do
        booking.destination_address.update(airport_id: airport.id)
        expect(options).to eq(options_structure)
      end
    end
  end

  describe '#vehicle' do
    subject(:vehicle) { service.send(:vehicle) }

    it 'should return booking vehicle' do
      expect(vehicle).to eq(booking.vehicle)
    end
  end

  def stub_api!
    stub_request(:get, "https://api.flightstats.com/flex/schedules/rest/v1/json/flight/AA/978/departing/2018/7/17")
      .to_return(status: 200, body: Rails.root.join('spec/fixtures/flightstats/flights_departing_response_aa978.json').read)
    stub_request(:get, "https://api.flightstats.com/flex/schedules/rest/v1/json/flight/AA/978/arriving/2018/7/17")
      .to_return(status: 200, body: Rails.root.join('spec/fixtures/flightstats/flights_arriving_response_aa978.json').read)
  end
end
