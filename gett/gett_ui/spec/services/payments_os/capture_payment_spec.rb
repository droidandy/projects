require 'rails_helper'

RSpec.describe PaymentsOS::CapturePayment, type: :service do
  let(:service) do
    PaymentsOS::CapturePayment.new(
      payment_id: 'paymentId',
      reconciliation_id: 'some-id'
    )
  end

  describe '#execute' do
    let(:response_body) { {data: 'token'}.to_json }
    let(:response) { double(body: response_body, code: 201) }

    before do
      expect(RestClient).to receive(:post)
        .with('https://api.paymentsos.com/payments/paymentId/captures', {
          'reconciliation_id' => 'some-id'
        }.to_json, anything)
        .and_return(response)
    end

    subject { service.execute }

    it { is_expected.to be_success }
    its('result.data') { is_expected.to eq('data' => 'token') }
  end
end
