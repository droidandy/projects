module System
  module Check
    module FinancePortalApi
      class DriverStats < ApplicationService
        def execute!
          response.success? ? success! : fail!
        end

        private def response
          client.driver_stats(
            id: 10
          )
        end

        private def client
          ::FinancePortalApi::Client.new
        end
      end
    end
  end
end
