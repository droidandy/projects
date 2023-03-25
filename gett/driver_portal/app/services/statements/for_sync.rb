module Statements
  class ForSync < ApplicationService
    attr_reader :statements_ids

    schema do
      required(:changed_after).maybe(:date_time?)
      required(:page).filled(:int?)
      required(:per_page).filled(:int?)
    end

    def execute!
      ids = process_response(response)
      return unless ids

      @statements_ids = Array.wrap(ids)
      success!
    end

    private def response
      @response ||= client.statements(
        changed_after: changed_after,
        ids_only: true,
        page: page,
        limit: per_page
      )
    end

    private def client
      @client ||= FinancePortalApi::Client.new
    end
  end
end
