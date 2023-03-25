module PaymentsOS
  class AuthorizePayment < Base
    http_method :post

    attributes :payment_id, :payment_method_token, :reconciliation_id

    def url
      super("payments/#{payment_id}/authorizations")
    end

    def params
      {
        payment_method_token: payment_method_token,
        reconciliation_id: reconciliation_id
      }
    end

    def success?
      !!result && response.data['result']['status'] == 'Succeed'
    end
  end
end
