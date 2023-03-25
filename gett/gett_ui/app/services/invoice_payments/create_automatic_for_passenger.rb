module InvoicePayments
  class CreateAutomaticForPassenger < ApplicationService
    attributes :passenger

    delegate :company, to: :passenger

    def execute!
      return success! if invoices.none?

      delegate_execution_to CreatePayment.new(
        invoices: invoices,
        payment_method_token: passenger.payment_cards.find(&:default?)&.token
      )
    end

    private def invoices
      @invoices ||= company.invoices_dataset.payable.where(member: passenger).all.reject(&:payment_pending?)
    end
  end
end
