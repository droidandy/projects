require 'rails_helper'

RSpec.describe PaymentsOS::CreatePaymentMethod, type: :service do
  let(:service) { described_class.new(customer_id: 'customer_id', token: 'token') }

  describe '#execute' do
    let(:response) { double(body: '{"foo": "bar"}', code: 201) }

    before do
      expect(RestClient).to receive(:post)
        .with('https://api.paymentsos.com/customers/customer_id/payment-methods/token', anything, anything)
        .and_return(response)
    end

    subject { service.execute }

    it { is_expected.to be_success }
    its('result.data') { is_expected.to eq('foo' => 'bar') }
  end
end
