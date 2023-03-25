module System
  module Check
    module FleetApi
      class Drivers < ApplicationService
        def execute!
          response.success? ? success! : fail!
        end

        private def response
          client.drivers(
            driver_ids: [10],
            fields: %i[id]
          )
        end

        private def client
          GettFleetApi::Client.new
        end
      end
    end
  end
end
