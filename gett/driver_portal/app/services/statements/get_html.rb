module Statements
  class GetHTML < ApplicationService
    attr_reader :html

    schema do
      required(:statement_id).filled(:int?)
    end

    def execute!
      if response.success?
        @html = response.response_body
        success!
      else
        fail!(errors: { data: 'was not retrieved' })
      end
    end

    private def response
      @response ||= client.statement_html(id: statement_id)
    end

    private def client
      @client ||= FinancePortalApi::Client.new
    end
  end
end
