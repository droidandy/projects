require 'rails_helper'
require 'spec_helper'

RSpec.describe Carey::Modify, type: :service do
  before { Timecop.freeze }
  after  { Timecop.return }

  subject(:service) { described_class.new(booking: booking) }

  let(:booking) do
    create(:booking,
      vehicle: create(:vehicle, :carey),
      scheduled_at: 10.minutes.from_now,
      passenger: create(:passenger, phone: '+1231231231'),
      service_id: 'WA10701683-1',
      quote_id: 'LS03',
      pickup_address: pickup_address
    )
  end
  let(:parsed_phone) { '231231231' }
  let(:pickup_address) { create(:address, country_code: 'US') }
  let(:stop_address) { create(:address) }
  let(:find_response) { double(body: { ota_ground_res_retrieve_rs: { :@version => "1" } }) }
  let(:response) do
    double(body: {
      ota_ground_book_rs: {
        reservation: {
          confirmation: { :@id => "WA10701683-1" },
          total_charge: { :@rate_total_amount => "245.60" }
        }
      }
    })
  end

  let(:find_savon_client) { double(operations: [:find_reservation]) }
  let(:savon_client) { double(operations: [:modify_reservation]) }
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
      Reservation: {
        ReferenceID: {
          :@ID => booking.service_id
        },
        Service: {
          ServiceLevel: {
            :@Code => 'Point-To-Point',
            :@Description => 'Premium'
          },
          VehicleType: {
            :@Code => booking.quote_id
          },
          Locations: {
            Pickup: {
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
            },
            Dropoff: {
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
            },
            Stops: {
              Stop: [{
                content!: {
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
              }]
            }
          }
        },
        Passenger: {
          Primary: {
            PersonName: {
              GivenName: booking.passenger.first_name,
              Surname: booking.passenger.last_name
            },
            Telephone: {
              :@PhoneNumber => parsed_phone,
              :@PhoneUseType => "1",
              :@CountryAccessCode => "1"
            },
            Email: booking.passenger.email
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

  before do
    booking.add_booking_address(
      address_id: stop_address.id,
      address_type: 'stop',
      stop_info: { name: 'Bob', phone: '+79998887766' }
    )

    allow(Savon).to receive(:client)
      .with(
        wsdl: 'http://localhost',
        element_form_default: :qualified,
        convert_request_keys_to: :camelcase,
        headers: {
          app_id: 'AppId',
          app_key: 'AppKey',
          'X-SOAP-Method': 'findReservation'
        }
      )
      .and_return(find_savon_client)
    allow(find_savon_client).to receive(:call).and_return(find_response)

    allow(Savon).to receive(:client)
      .with(
        wsdl: 'http://localhost',
        element_form_default: :qualified,
        convert_request_keys_to: :camelcase,
        headers: {
          app_id: 'AppId',
          app_key: 'AppKey',
          'X-SOAP-Method': 'modifyReservation'
        }
      )
      .and_return(savon_client)
    allow(savon_client).to receive(:call).and_return(response)
    allow(service).to receive(:last_version).and_return("1")
    allow(service).to receive(:sequence_number).and_return('12345')
  end

  describe '#execute' do
    before do
      expect(savon_client).to receive(:call)
        .with(:modify_reservation, message: message, attributes: { Version: "1", SequenceNmbr: '12345' })
        .and_return(response)
      service.execute
    end

    it { is_expected.to be_success }
  end
end
