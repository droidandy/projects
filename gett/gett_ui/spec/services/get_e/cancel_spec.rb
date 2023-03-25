require 'rails_helper'

RSpec.describe GetE::Cancel, type: :service do
  subject(:service) { described_class.new(booking: booking) }

  service_context { { company: booking.booker.company } }

  describe '#execute' do
    let(:booking) { create(:booking, :scheduled, service_id: 123123123, vehicle: create(:vehicle, :get_e), scheduled_at: 2.hours.from_now) }

    context 'when succeeds' do
      let(:transfer_response) do
        {
          service_id: 3147710150,
          status: 'CANCELLED',
          fare_quote: 11.1
        }
      end

      let(:transfer_service_stub) do
        double(execute: double(success?: true, normalized_response: transfer_response))
      end

      let(:cancel_response) { double(body: "", code: 200) }

      let(:response) { double(body: transfer_response.to_json, code: 200) }

      before do
        allow(GetE::Transfer).to receive(:new).and_return(transfer_service_stub)
        expect(RestClient).to receive(:delete)
          .with("https://localhost/transfers/#{booking.service_id}", authorization: "X-Api-Key TestKey")
          .and_return(cancel_response)
        service.execute
      end

      it { is_expected.to be_success }
      its(:cancellation_quote) { is_expected.to eq(11.1) }
    end

    context 'when failure' do
      let(:message) { 'no money, no honey' }
      let(:error_body) { { "ErrorMessage": message }.to_json }
      let(:cancel_response) { double(body: error_body, code: 400) }

      before do
        expect(RestClient).to receive(:delete)
          .with("https://localhost/transfers/#{booking.service_id}", authorization: "X-Api-Key TestKey")
          .and_return(cancel_response)
        service.execute
      end

      it { is_expected.not_to be_success }
      its(:error_message) { is_expected.to eq(message) }
    end
  end
end
