class PaymentsStatusUpdater < ApplicationWorker
  sidekiq_options queue: :default, retry: false

  def perform
    Payment.pending.pluck(:id).each do |payment_id|
      PaymentStatusUpdater.perform_async(payment_id)
    end
  end
end
