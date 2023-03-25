require 'rails_helper'

RSpec.describe PaymentsOS::AuthorizePayment, type: :service do
  let(:service) do
    PaymentsOS::AuthorizePayment.new(
      payment_id: 'paymentId',
      payment_method_token: 'token',
      reconciliation_id: 'some-id'
    )
  end

  describe '#execute' do
    let(:response_body) { {'result' => {'status' => 'Succeed'}}.to_json }
    let(:response) { double(body: response_body, code: 201) }

    before do
      expect(RestClient).to receive(:post)
        .with('https://api.paymentsos.com/payments/paymentId/authorizations', {
          'payment_method_token' => 'token',
          'reconciliation_id'    => 'some-id'
        }.to_json, anything)
        .and_return(response)
    end

    subject { service.execute }

    it { is_expected.to be_success }
  end
end
