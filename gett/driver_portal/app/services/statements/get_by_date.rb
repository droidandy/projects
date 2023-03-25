module Statements
  class GetByDate < ApplicationService
    attr_reader :statement

    schema do
      required(:issued_at).filled(:date_time?)
    end

    def execute!
      if raw_statements.any?
        @statement = Statements::Parser.new(raw_statements.first).parse
        success!
      else
        fail!
      end
    end

    private def raw_statements
      @raw_statements ||= response.success? ? response.body : []
    end

    private def response
      @response ||= client.statements(at: issued_at, driver_ids: [current_user.gett_id])
    end

    private def client
      @client ||= FinancePortalApi::Client.new
    end
  end
end
