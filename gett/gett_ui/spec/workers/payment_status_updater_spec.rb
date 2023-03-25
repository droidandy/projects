require 'rails_helper'

RSpec.describe PaymentStatusUpdater, type: :worker do
  let(:payment) { create(:payment, :pending) }
  let(:worker)  { described_class.new }
  let(:service_stub) { double }

  it 'calls Payments::StatusUpdater worker for payment' do
    expect(service_stub).to receive(:execute)

    expect(Payments::StatusUpdater).to receive(:new)
      .with(payment: payment).and_return(service_stub)

    worker.perform(payment.id)
  end
end
