require 'rails_helper'

RSpec.describe GetE::Create, type: :service do
  subject(:service) { described_class.new(booking: booking) }

  service_context { { company: booking.booker.company } }

  describe '#execute' do
    let(:booking) { create(:booking, :scheduled, vehicle: create(:vehicle, :get_e), scheduled_at: 2.hours.from_now) }

    context 'when succeeds' do
      let(:quote_response) do
      {
        "data": {
          "Unid": 3099937157,
          "Status": "Booked",
          "Pickup": {
            "Time": "2017-11-15T14:00:00+0100",
            "Address": "Schillingweg 79, 2153 PL Nieuw-Vennep, Netherlands",
            "Name": "Schillingweg 79, 2153 PL Nieuw-Vennep, Netherlands",
            "Location": {
              "Latitude": 52.256422,
              "Longitude": 4.631382
            }
          },
          "DropOff": {
            "Time": "2017-11-15T14:00:00+0100",
            "Address": "Schillingweg 79, 2153 PL Nieuw-Vennep, Netherlands",
            "Name": "Schillingweg 79, 2153 PL Nieuw-Vennep, Netherlands",
            "Location": {
              "Latitude": 52.256422,
              "Longitude": 4.631382
            }
          },
          "CarOption": {
            "Uuid": "75dbbc32-8cab-3ccc-9a36-6f755ba430d8",
            "Details": {
              "Name": "Business Minivan",
              "Class": "Business",
              "Type": "Van",
              "Description": "",
              "CarThumbnail": "https://static.get-e.com/images/cars-3d/business-van.png",
              "Attributes": [],
              "Capacity": {
                "Passengers": 6,
                "Bags": 6
              },
              "FreeWaitingTime": 900,
              "PickupDescription": "The driver will wait for a maximum of 15 minutes after arrival at the location. In case you experience any delay in meeting the driver please call the following local number(s) immediately: +31 20 653 00 05"
            },
            "Pricing": {
              "Price": {
                "Amount": 141.92,
                "IsoCurrency": "GBP"
              },
              "CancellationFee": [
                {
                  "ValidAfter": "2017-11-14T14:00:00+0100",
                  "Price": {
                    "Amount": 141.92,
                    "IsoCurrency": "GBP"
                  }
                }
              ]
            }
          },
          "Predictions": {
            "Duration": 0,
            "Distance": 0
          },
          "Passengers": [
            {
              "Uuid": "38754217-25e4-386c-b9bb-fd1bd161267f",
              "FirstName": "Ireland",
              "LastName": "Country",
              "Email": "adsflk@dfss.ss",
              "PhoneNumber": "453534525435",
              "Primary": true
            }
          ],
          "Occupancy": {
            "Passengers": 3,
            "Bags": 3
          },
          "Driver": {
            "Name": nil,
            "Phone": nil
          },
          "Info": {
            "AgentReference": "",
            "CustomerRequest": "",
            "ConnectionDetails": {
              "Name": "",
              "Number": "",
              "Type": ""
            }
          },
          "Pricing": {
            "Price": {
              "Amount": 141.92,
              "IsoCurrency": "GBP"
            },
            "Breakdown": [
              {
                "CostType": "Base",
                "Description": "cost of service",
                "Price": {
                  "Amount": "141.92",
                  "IsoCurrency": "GBP"
                }
              }
            ]
          }
        }
      }
      end
      let(:response) { double(body: quote_response.to_json, code: 200) }
      let(:expected_response) do
        {
          service_id: 3099937157,
          fare_quote: 14192
        }
      end

      before do
        expect(service).to receive(:params).and_return('params')
        expect(RestClient).to receive(:post)
          .with('https://localhost/transfers', 'params', authorization: "X-Api-Key TestKey")
          .and_return(response)
        service.execute
      end

      it { is_expected.to be_success }
      its(:normalized_response) { is_expected.to eq expected_response }
    end

    context 'when booking has no flight' do
      specify '#params' do
        expect(service.send(:params)).to match(
          Passengers: {
            '1': {
              FirstName: booking.passenger_info[:first_name],
              LastName: booking.passenger_info[:last_name],
              Email: booking.passenger_info[:email],
              PhoneNumber: booking.passenger_info[:phone_number],
              Primary: '1'
            }
          },
          Option: {
            Uuid: booking.quote_id
          },
          Occupancy: {
            Passengers: 3,
            Bags: 3
          },
          Info: {
            CustomerRequest: "Some message",
            ConnectionDetails: {}
          }
        )
      end
    end

    context 'when booking has a flight' do
      let(:booking) { create(:booking, :scheduled, vehicle: create(:vehicle, :get_e), scheduled_at: 2.hours.from_now, flight: 'EK5') }
      specify '#params' do
        expect(service.send(:params)[:Info]).to match(
          CustomerRequest: 'Flight: EK5, Some message',
          ConnectionDetails: {
            Number: 'EK5',
            Type: 'Airline'
          }
        )
      end
    end

    context 'when new passenger' do
      let(:booking) { create(:booking, :scheduled, :without_passenger, vehicle: create(:vehicle, :get_e), scheduled_at: 2.hours.from_now) }
      specify '#params' do
        expect(service.send(:params)[:Passengers][:'1'][:Email]).to eq('12345678900@gett.com')
      end
    end
  end
end
