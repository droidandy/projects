module PaymentsOS
  class CreatePayment < Base
    http_method :post

    attributes :amount, :currency, :statement_soft_descriptor, :order, :additional_details

    def url
      super("payments")
    end

    def params
      {
        amount: amount,
        currency: currency,
        statement_soft_descriptor: statement_soft_descriptor,
        order: order,
        additional_details: additional_details
      }
    end
  end
end
