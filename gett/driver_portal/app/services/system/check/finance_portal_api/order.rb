module System
  module Check
    module FinancePortalApi
      class Order < ApplicationService
        def execute!
          response.success? ? success! : fail!
        end

        private def response
          client.order(
            id: 14347135
          )
        end

        private def client
          ::FinancePortalApi::Client.new
        end
      end
    end
  end
end
