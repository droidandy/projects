module Orders
  class TotalDistance < ApplicationService
    attr_reader :distance

    schema do
      required(:user_id).filled(:int?)
    end

    def execute!
      unless user
        fail!(errors: { user: 'not found' })
        return
      end
      return unless orders

      @distance = orders.sum do |order|
        order['distance'].to_f
      end

      success!
    end

    private def orders
      @orders ||= if response.success?
                    response.body
                  else
                    fail!(errors: { data: 'was not retrieved' })
                    nil
                  end
    end

    private def response
      @response ||= client.orders(
        from: from,
        to: to,
        driver_ids: [user.gett_id]
      )
    end

    private def from
      Time.current.beginning_of_week
    end

    private def to
      Time.current.end_of_week
    end

    private def client
      @client ||= FinancePortalApi::Client.new
    end

    private def user
      @user ||= begin
        search = Users::Search.new({ id: user_id }, current_user: current_user)
        search.one
      end
    end
  end
end
