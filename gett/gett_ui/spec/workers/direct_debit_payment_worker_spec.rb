require 'rails_helper'

RSpec.describe DirectDebitPaymentWorker, type: :worker do
  let(:invoice) { create(:invoice) }
  let(:worker) { DirectDebitPaymentWorker.new }

  it 'executes DirectDebitPayments::Create service with given invoice' do
    service = double('DirectDebitPayments::Create')
    expect(DirectDebitPayments::Create).to receive(:new).with(invoice: invoice).and_return(service)
    expect(service).to receive(:execute)

    worker.perform(invoice.id)
  end
end
