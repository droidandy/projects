module Orders
  class Get < ApplicationService
    attr_reader :order

    schema do
      required(:order_id).filled
    end

    def execute!
      if raw_order
        @order = Orders::Parser.new(raw_order).parse
        success!
      else
        fail!
      end
    end

    private def raw_order
      @raw_order ||= (response.body if response.success?)
    end

    private def response
      @response ||= client.order(id: order_id)
    end

    private def client
      @client ||= FinancePortalApi::Client.new
    end
  end
end
