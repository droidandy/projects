module PaymentsOS
  class CreatePaymentMethod < Base
    http_method :post
    api_version '1.2.0'

    attributes :customer_id, :token

    def url
      super("customers/#{customer_id}/payment-methods/#{token}")
    end
  end
end
