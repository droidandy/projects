require 'rails_helper'

RSpec.describe PaymentsStatusUpdater, type: :worker do
  let(:payment) { create(:payment, :pending) }
  let(:worker)  { described_class.new }

  it 'calls PaymentStatusUpdater worker for pending payments' do
    expect(PaymentStatusUpdater).to receive(:perform_async).with(payment.id)

    worker.perform
  end
end
