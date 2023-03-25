class DirectDebitPaymentWorker < ApplicationWorker
  sidekiq_options queue: :default

  def perform(invoice_id)
    DirectDebitPayments::Create.new(invoice: Invoice[invoice_id]).execute
  end
end
