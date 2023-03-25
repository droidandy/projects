class PaymentStatusUpdater < ApplicationWorker
  sidekiq_options queue: :default, retry: false

  def perform(payment_id)
    payment = Payment.with_pk!(payment_id)

    Payments::StatusUpdater.new(payment: payment).execute
  end
end
