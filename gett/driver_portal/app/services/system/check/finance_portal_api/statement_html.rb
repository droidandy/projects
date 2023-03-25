module System
  module Check
    module FinancePortalApi
      class StatementHTML < ApplicationService
        def execute!
          response.success? ? success! : fail!
        end

        private def response
          client.statement_html(
            id: 3047289
          )
        end

        private def client
          ::FinancePortalApi::Client.new
        end
      end
    end
  end
end
