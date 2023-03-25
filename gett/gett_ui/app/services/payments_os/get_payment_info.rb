module PaymentsOS
  class GetPaymentInfo < Base
    http_method :get

    attributes :payment_id, :expand

    def url
      super("payments/#{payment_id}?#{expand_param}")
    end

    private def expand_param
      expand.present? ? { expand: expand }.to_param : ''
    end
  end
end
