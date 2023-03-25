module GoCardless
  class PaymentEventProcessor < ApplicationService
    include ApplicationService::ModelMethods

    attributes :payment, :event

    def execute!
      case event[:action]
      when 'paid_out'
        payment_completed
      when 'cancelled', 'failed', 'charged_back', 'chargeback_settled'
        payment_failed
      end
    end

    private def payment_completed
      update_model(payment, status: DirectDebitPayment::SUCCESSFUL)
      DirectDebitMailer.payment_completed(payment.id).deliver_later
      payment.invoice.mark_as_paid!
    end

    private def payment_failed
      update_model(payment, status: DirectDebitPayment::FAILED)
    end
  end
end
