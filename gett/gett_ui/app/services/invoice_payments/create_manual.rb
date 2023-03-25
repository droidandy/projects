module InvoicePayments
  class CreateManual < ApplicationService
    include ApplicationService::Context
    include ApplicationService::Policy

    attributes :card_token, :invoice_ids

    delegate :company, to: :context

    def execute!
      invoices = load_invoices
      return if errors.present?

      create_payment_service = CreatePayment.new(
        invoices: invoices,
        payment_method_token: card_token
      )
      create_payment_service.execute

      if create_payment_service.success?
        success!
      else
        set_errors('Cannot process the payment')
      end
    end

    private def load_invoices
      invoices = company.invoices_dataset.payable.where(id: invoice_ids)

      set_errors('No invoices selected') if invoices.none?

      if invoices.count != invoice_ids.count || invoices.any?(&:payment_pending?)
        set_errors('Cannot pay for selected invoices')
      end

      invoices
    end
  end
end
