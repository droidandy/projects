require 'rails_helper'

RSpec.describe PaymentsOS::CreateCustomer, type: :service do
  let(:service) { described_class.new }

  describe '#execute' do
    let(:response_body) { { id: 'customer_id' }.to_json }
    let(:response) { double(body: response_body, code: 201) }

    before do
      expect(RestClient).to receive(:post)
        .with('https://api.paymentsos.com/customers', anything, anything)
        .and_return(response)
    end

    subject { service.execute }

    it { is_expected.to be_success }
    its(:result) { is_expected.to eq('customer_id') }
  end
end
