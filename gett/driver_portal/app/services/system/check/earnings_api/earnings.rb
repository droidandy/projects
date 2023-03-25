module System
  module Check
    module EarningsApi
      class Earnings < ApplicationService
        def execute!
          response.success? ? success! : fail!
        end

        private def response
          client.earnings(
            driver_id: 10,
            from: '2017-11-15T00:00:00Z',
            to: '2017-11-16T00:00:00Z'
          )
        end

        private def client
          GettEarningsApi::Client.new
        end
      end
    end
  end
end
