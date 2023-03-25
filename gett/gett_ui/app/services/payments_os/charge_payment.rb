module PaymentsOS
  class ChargePayment < Base
    http_method :post

    attributes :payment_id, :payment_method_token, :reconciliation_id

    def url
      super("payments/#{payment_id}/charges")
    end

    def params
      {
        payment_method_token: payment_method_token,
        reconciliation_id: reconciliation_id
      }
    end
  end
end
