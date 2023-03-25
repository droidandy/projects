module Statements
  class List < ApplicationService
    attr_reader :statements

    schema do
      required(:driver).filled
      optional(:from).maybe(:date_time?)
      optional(:to).maybe(:date_time?)
      optional(:page).maybe(:int?)
      optional(:per_page).maybe(:int?)
      optional(:statements_ids).maybe(:array?)
    end

    def execute!
      return unless raw_statements

      @statements = raw_statements.map do |statement|
        Statements::Parser.new(statement).parse
      end
      success!
    end

    private def raw_statements
      @raw_statements ||= if response.success?
                            response.body
                          else
                            fail!(errors: { data: 'was not retrieved' })
                            nil
                          end
    end

    private def response
      @response ||= client.statements(
        from: from,
        to: to,
        driver_ids: [driver.gett_id],
        ids: Array.wrap(statements_ids),
        page: page,
        limit: per_page
      )
    end

    private def client
      @client ||= FinancePortalApi::Client.new
    end
  end
end
