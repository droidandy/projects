require 'go_cardless_client_builder'

module DirectDebitPayments
  class Create < ApplicationService
    include ApplicationService::ModelMethods
    attributes :invoice
    delegate :company, to: :invoice

    CURRENCY = 'GBP'.freeze

    def execute!
      return if invoice.paid? || invoice.payment_pending?
      return unless company.direct_debit_set_up?

      payment_request = client.payments.create(
        params: {
          amount: payment.amount_cents,
          currency: payment.currency,
          links: {
            mandate: payment.direct_debit_mandate.go_cardless_mandate_id
          }
        },
        headers: {
          'Idempotency-Key' => idempotency_key
        }
      )

      result { create_model(payment, go_cardless_payment_id: payment_request.id) }
    end

    private def payment
      @payment ||= DirectDebitPayment.new(
        invoice_id: invoice.id,
        direct_debit_mandate: company.direct_debit_mandate,
        amount_cents: invoice.amount_cents,
        currency: CURRENCY,
        status: DirectDebitPayment::PENDING
      )
    end

    private def client
      @client ||= GoCardlessClientBuilder.build
    end

    private def idempotency_key
      "invoice-payment-#{invoice.id}-#{invoice.direct_debit_payments.count}"
    end
  end
end
