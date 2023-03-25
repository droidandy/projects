require 'rails_helper'

RSpec.describe PaymentsOS::GetTokenInfo, type: :service do
  let(:service) { described_class.new(token: 'token') }

  before do
    expect(PaymentsOS::CreateCustomer).to receive_message_chain(:new, :execute, :result)
      .and_return('customer_id')

    create_payment_method_service = double('PaymentsOS::CreatePaymentMethod')

    expect(create_payment_method_service).to receive_message_chain(:execute, :success?)
      .and_return(true)

    expect(create_payment_method_service).to receive(:data).and_return(
      'last_4_digits' => '1234',
      'expiration_date' => '12/20'
    )

    expect(PaymentsOS::CreatePaymentMethod).to receive(:new)
      .with(customer_id: 'customer_id', token: 'token')
      .and_return(create_payment_method_service)
  end

  it 'returns card info' do
    service.execute
    expect(service).to be_success
    expect(service.result).to eq(
      last_4: '1234',
      expiration_month: 12,
      expiration_year: 2020
    )
  end
end
