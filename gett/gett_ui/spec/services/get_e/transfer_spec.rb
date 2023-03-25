require 'rails_helper'

RSpec.describe GetE::Transfer, type: :service do
  subject(:service) { described_class.new(booking: booking) }

  service_context { { company: booking.booker.company } }

  describe '#execute' do
    let(:booking) { create(:booking, :scheduled, vehicle: create(:vehicle, :get_e), scheduled_at: 2.hours.from_now) }

    context 'when succeeds' do
      let(:transfer_response) do
        {
          "data": {
            "Unid": 3147710150,
            "Status": "Cancelled",
            "StatusCode": "CANCELLED",
            "Pricing": {
              "Price": { "Amount": 1.11, "IsoCurrency": "GBP" },
              "Breakdown": [
                {
                  "CostType": "Base",
                  "Description": "Cost of service",
                  "Price": {"Amount": 1.11, "IsoCurrency": "GBP"}
                }
              ]
            }
          }
        }
      end
      let(:response) { double(body: transfer_response.to_json, code: 200) }
      let(:transfer_result) do
        {
          service_id: 3147710150,
          status: 'CANCELLED',
          fare_quote: 111
        }
      end

      before do
        expect(service).to receive(:params).and_return('params')
        expect(RestClient).to receive(:get)
          .with('https://localhost/transfers/', params: "params", authorization: "X-Api-Key TestKey")
          .and_return(response)
        service.execute
      end

      it { is_expected.to be_success }
      its(:normalized_response) { is_expected.to eq(transfer_result) }
    end
  end
end
