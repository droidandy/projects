module Payments
  class Webhook < ApplicationService
    attributes :payments_os_id

    def execute!
      payment = Payment.first(payments_os_id: payments_os_id)
      Payments::StatusUpdater.new(payment: payment).execute if payment.present?
    end
  end
end
