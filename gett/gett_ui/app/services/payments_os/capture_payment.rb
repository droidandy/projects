module PaymentsOS
  class CapturePayment < Base
    http_method :post

    attributes :payment_id, :reconciliation_id

    def url
      super("payments/#{payment_id}/captures")
    end

    def params
      { reconciliation_id: reconciliation_id }
    end
  end
end
