module System
  module Check
    module FinancePortalApi
      class Statements < ApplicationService
        def execute!
          response.success? ? success! : fail!
        end

        private def response
          client.statements(
            ids: [2950502],
            limit: 10,
            page: 1,
            driver_ids: [76],
            from: "2017-10-22T00:00:00Z",
            to: "2017-10-29T23:59:59Z",
            order_ids: [13996462]
          )
        end

        private def client
          ::FinancePortalApi::Client.new
        end
      end
    end
  end
end
