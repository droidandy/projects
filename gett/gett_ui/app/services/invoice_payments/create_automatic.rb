module InvoicePayments
  class CreateAutomatic < ApplicationService
    attributes :company

    def execute!
      return success! if invoices.none?

      delegate_execution_to CreatePayment.new(
        invoices: invoices,
        payment_method_token: company.payment_card&.token
      )
    end

    private def invoices
      @invoices ||= company.invoices_dataset.payable.all.reject(&:payment_pending?)
    end
  end
end
