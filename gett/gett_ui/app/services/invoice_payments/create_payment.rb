module InvoicePayments
  class CreatePayment < ApplicationService
    attributes :invoices, :payment_method_token

    def execute!
      create_payment_service = Payments::Create.new(
        payment_method_token: payment_method_token,
        order_id: order_id,
        statement_soft_descriptor: statement_soft_descriptor,
        payment_params: {
          invoice_pks: invoice_ids,
          amount_cents: amount_cents,
          description: payment_description
        }
      )

      create_payment_service.execute do |payment|
        Invoice.where(id: invoice_ids).all.each(&:mark_as_paid!) if payment.successful?
      end

      success! if create_payment_service.success?
    end

    private def invoice_ids
      @invoice_ids ||= invoices.pluck(:id)
    end

    private def amount_cents
      invoices.map(&:amount_cents).reduce(&:+)
    end

    private def order_id
      "invoices_#{invoice_ids.join('_')}"
    end

    private def statement_soft_descriptor
      "OT invoice(s): #{invoices.map(&:id).join(', ')}"
    end

    private def payment_description
      "Invoices #{invoices.map(&:id).join(', ')}"
    end
  end
end
