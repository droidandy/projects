module PaymentsOS
  class CreateCustomer < Base
    http_method :post
    api_version '1.2.0'

    def execute!
      make_request!
      result { response.data['id'] } if response.success?
    end

    def url
      super('customers')
    end

    def params
      {
        customer_reference: SecureRandom.uuid
      }
    end
  end
end
