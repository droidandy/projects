module Companies
  class Dashboard
    def initialize(member)
      @company = member.company
    end

    attr_reader :result

    def execute!
      @result = {
        name:         @company.name,
        logo_url:     logo_url,
        orders_count: orders_count(:all),
        internal_messages: internal_messages,
        external_messages: external_messages,
        order_counts: {
          live: orders_count(:active),
          future: orders_count(:future)
        }
      }
    end

    private def logo_url
      return unless @company.logo
      "#{@company.logo.url}?t=#{@company.updated_at.to_datetime.strftime('%Q')}"
    end

    private def internal_messages
      Message.where(company: @company).order(created_at: :desc).includes(:sender).map do |message|
        ::Messages::Show.new(message: message).execute.result
      end
    end

    private def external_messages
      Message.external.order(created_at: :desc).map do |message|
        ::Messages::Show.new(message: message).execute.result
      end
    end

    private def orders_count(state)
      s = service
      s.state = state
      s.remote_records.first[:orders_count]
    end

    private def service
      ::OrdersCountRequest.new(@company.fleet_id)
    end
  end
end
