require 'rails_helper'

RSpec.describe Payments::Create, type: :service do
  describe '#execute' do
    let(:booking) { create(:booking) }
    let(:service_params) do
      {
        payment_method_token: 'card-token',
        order_id: 'order id',
        statement_soft_descriptor: 'statement soft descriptor',
        payment_params: {
          booking: booking,
          description: 'payment description',
          amount_cents: 5050
        }
      }
    end

    subject(:service) { Payments::Create.new(service_params) }

    context 'successful payment already exists' do
      let!(:payment) { create(:payment, :captured, booking: booking, amount_cents: 5050) }

      it 'takes no action' do
        expect{ service.execute }.to_not change(Payment, :count)
        expect(payment).to be_successful
      end
    end

    context 'successful payment for specified invoices already exists' do
      let(:invoices) { create_list(:invoice, 2) }
      let!(:payment) do
        create(:payment, :captured, booking: nil, invoice_pks: invoices.map(&:id), amount_cents: 5050)
      end
      before do
        service_params[:payment_params] = { amount_cents: 5050, invoice_pks: invoices.map(&:id) }
      end

      it 'takes no action' do
        expect{ service.execute }.to_not change(Payment, :count)
        expect(payment).to be_successful
      end
    end

    context 'failed payment already exists' do
      let!(:payment) do
        create(:payment, :failed, booking: booking, amount_cents: 5050, payments_os_id: 'payment-id')
      end

      before do
        authorize_payment_succeeds
        capture_payment_succeeds
      end

      it 're-uses existing payment' do
        expect(service.execute).to be_success
        payment.reload
      end
    end

    context 'all operations succeed' do
      before do
        create_payment_succeeds
        authorize_payment_succeeds
        capture_payment_succeeds
      end

      it 'executes successfully' do
        expect(service.execute).to be_success
        payment = service.result
        expect(payment.status).to eq('captured')
        expect(payment.payments_os_id).to eq('payment-id')
        expect(payment.zooz_request_id).to eq('x')
      end
    end

    context 'create payment fails' do
      before { create_payment_fails }

      it 'does not create a payment' do
        expect{ service.execute }.not_to change(Payment, :count)
      end
    end

    context 'authorize payment fails' do
      before do
        create_payment_succeeds
        authorize_payment_fails
      end

      it 'creates a failed payment' do
        expect(service.execute).not_to be_success
        payment = service.send(:payment)
        expect(payment.status).to eq('failed')
        expect(payment.payments_os_id).to eq('payment-id')
        expect(payment.error_description).to eq('{:foo=>"bar"}')
      end
    end

    context 'capture payment fails' do
      before do
        create_payment_succeeds
        authorize_payment_succeeds
        capture_payment_fails
      end

      it 'creates a failed payment' do
        expect(service.execute).not_to be_success
        payment = service.send(:payment)
        expect(payment.status).to eq('failed')
        expect(payment.payments_os_id).to eq('payment-id')
        expect(payment.error_description).to eq('{:foo=>"bar"}')
      end
    end

    context 'capture payment pending' do
      before do
        create_payment_succeeds
        authorize_payment_succeeds
        capture_payment_succeeds('Pending')
      end

      it 'creates a pending payment' do
        expect(service.execute).to be_success
        payment = service.result
        expect(payment.status).to eq('pending')
        expect(payment.payments_os_id).to eq('payment-id')
      end
    end

    context 'capture payment returns "Failed"' do
      before do
        create_payment_succeeds
        authorize_payment_succeeds
        capture_payment_succeeds('Failed')
      end

      it 'creates a failed payment' do
        expect(service.execute).not_to be_success
        payment = service.send(:payment)
        expect(payment.status).to eq('failed')
        expect(payment.payments_os_id).to eq('payment-id')
      end
    end
  end

  let(:headers) { { x_zooz_request_id: 'x' } }

  def create_payment_succeeds
    service = double('PaymentsOS::CreatePayment')
    expect(PaymentsOS::CreatePayment).to receive(:new).with(
      amount: 50.5,
      currency: 'GBP',
      statement_soft_descriptor: 'statement soft descriptor',
      additional_details: { description: 'payment description' },
      order: { id: 'order id' }
    ).and_return(service)
    expect(service).to receive(:execute).and_return(service)
    expect(service).to receive(:success?).and_return(true)
    expect(service).to receive(:data).and_return('id' => 'payment-id')
    expect(service).to receive(:headers).and_return(headers)
  end

  def create_payment_fails
    service = double('PaymentsOS::CreatePayment')
    expect(PaymentsOS::CreatePayment).to receive(:new).with(
      amount: 50.5,
      currency: 'GBP',
      statement_soft_descriptor: 'statement soft descriptor',
      additional_details: { description: 'payment description' },
      order: { id: 'order id' }
    ).and_return(service)
    expect(service).to receive(:execute).and_return(service)
    expect(service).to receive(:success?).and_return(false)
    expect(service).to receive(:data).and_return(foo: 'bar')
    allow(service).to receive(:headers).and_return(headers)
  end

  def authorize_payment_succeeds
    service = double('PaymentsOS::AuthorizePayment')
    expect(PaymentsOS::AuthorizePayment).to receive(:new).with(
      payment_id: 'payment-id',
      payment_method_token: 'card-token',
      reconciliation_id: 'order id'
    ).and_return(service)
    expect(service).to receive(:execute).and_return(service)
    expect(service).to receive(:success?).and_return(true)
    allow(service).to receive(:headers).and_return(headers)
  end

  def authorize_payment_fails
    service = double('PaymentsOS::AuthorizePayment')
    expect(PaymentsOS::AuthorizePayment).to receive(:new).with(
      payment_id: 'payment-id',
      payment_method_token: 'card-token',
      reconciliation_id: 'order id'
    ).and_return(service)
    expect(service).to receive(:execute).and_return(service)
    expect(service).to receive(:success?).and_return(false)
    expect(service).to receive(:data).and_return(foo: 'bar')
    expect(service).to receive(:headers).and_return(headers)
  end

  def capture_payment_succeeds(status = 'Succeed')
    service = double('PaymentsOS::CapturePayment')
    expect(PaymentsOS::CapturePayment).to receive(:new).with(
      payment_id: 'payment-id',
      reconciliation_id: 'order id'
    ).and_return(service)
    expect(service).to receive(:execute).and_return(service)
    expect(service).to receive(:success?).and_return(true)
    allow(service).to receive(:data).and_return('result' => { 'status' => status })
    expect(service).to receive(:headers).and_return(headers)
  end

  def capture_payment_fails
    service = double('PaymentsOS::CapturePayment')
    expect(PaymentsOS::CapturePayment).to receive(:new).with(
      payment_id: 'payment-id',
      reconciliation_id: 'order id'
    ).and_return(service)
    expect(service).to receive(:execute).and_return(service)
    expect(service).to receive(:success?).and_return(false)
    expect(service).to receive(:data).and_return('result' => { foo: 'bar' })
    allow(service).to receive(:headers).and_return(headers)
  end
end
