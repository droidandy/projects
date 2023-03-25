require 'rails_helper'

RSpec.describe GetE::Modify, type: :service do
  subject(:service) { described_class.new(booking: booking) }

  service_context { { company: booking.booker.company } }

  describe '#execute' do
    let(:booking) { create(:booking, :scheduled, vehicle: create(:vehicle, :get_e), scheduled_at: 2.hours.from_now, flight: flight) }
    let(:flight) { '' }

    context 'when succeeds' do
      let(:quote_response) do
        {"data" =>
          {"Unid" => 3099937157,
           "Status" => "Booked",
           "Pickup" =>
            {"Time" => "2017-11-15T14:00:00+0100",
             "Address" => "Schillingweg 79, 2153 PL Nieuw-Vennep, Netherlands",
             "Name" => "Schillingweg 79, 2153 PL Nieuw-Vennep, Netherlands",
             "Location" => {"Latitude" => 52.256422, "Longitude" => 4.631382}},
           "DropOff" =>
              {"Time" => "2017-11-15T14:00:00+0100",
               "Address" => "Schillingweg 79, 2153 PL Nieuw-Vennep, Netherlands",
               "Name" => "Schillingweg 79, 2153 PL Nieuw-Vennep, Netherlands",
               "Location" => {"Latitude" => 52.256422, "Longitude" => 4.631382}},
           "CarOption" =>
                {"Uuid" => "75dbbc32-8cab-3ccc-9a36-6f755ba430d8",
                 "Details" =>
                  {"Name" => "Business Minivan",
                   "Class" => "Business",
                   "Type" => "Van",
                   "Description" => "",
                   "CarThumbnail" => "https://static.get-e.com/images/cars-3d/business-van.png",
                   "Attributes" => [],
                   "Capacity" => {"Passengers" => 6, "Bags" => 6},
                   "FreeWaitingTime" => 900,
                   "PickupDescription" =>
                    "The driver will wait for a maximum of 15 minutes after arrival at the location. In case you experience any delay in meeting the driver please call the following local number(s) immediately: +31 20 653 00 05"},
                 "Pricing" => {"Price" => {"Amount" => 141.92, "IsoCurrency" => "GBP"}, "CancellationFee" => [{"ValidAfter" => "2017-11-14T14:00:00+0100", "Price" => {"Amount" => 141.92, "IsoCurrency" => "GBP"}}]}},
           "Predictions" => {"Duration" => 0, "Distance" => 0},
           "Passengers" => [{"Uuid" => "38754217-25e4-386c-b9bb-fd1bd161267f", "FirstName" => "Ireland", "LastName" => "Country", "Email" => "adsflk@dfss.ss", "PhoneNumber" => "453534525435", "Primary" => true}],
           "Occupancy" => {"Passengers" => 3, "Bags" => 3},
           "Driver" => {"Name" => nil, "Phone" => nil},
           "Info" => {"AgentReference" => "", "CustomerRequest" => "", "ConnectionDetails" => {"Name" => "", "Number" => "", "Type" => ""}},
           "Pricing" => {"Price" => {"Amount" => 141.92, "IsoCurrency" => "GBP"}, "Breakdown" => [{"CostType" => "Base", "Description" => "cost of service", "Price" => {"Amount" => "141.92", "IsoCurrency" => "GBP"}}]}}}
      end
      let(:response) { double(body: quote_response.to_json, code: 200) }

      before do
        expect(service).to receive(:params).and_return('params')
        expect(RestClient).to receive(:patch)
          .with('https://localhost/transfers/service-id', 'params', authorization: "X-Api-Key TestKey")
          .and_return(response)
        service.execute
      end

      it { is_expected.to be_success }
      its('response.data') { is_expected.to eq quote_response }
    end

    describe '#params' do
      subject(:params) { service.send(:params) }

      let(:options) do
        {
          Occupancy: {
            Passengers: 3,
            Bags: 3
          },
          Option: {
            Uuid: booking.quote_id
          },
          Info: {
            CustomerRequest: booking.message_to_driver,
            ConnectionDetails: {}
          }
        }
      end

      it { is_expected.to eq(options) }

      context 'when flight data exists' do
        let(:flight) { 'B666' }
        its([:Info, :ConnectionDetails]) { is_expected.to eq(Number: 'B666', Type: 'Airline') }
      end
    end
  end
end
