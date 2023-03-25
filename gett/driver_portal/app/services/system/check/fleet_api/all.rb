module System
  module Check
    module FleetApi
      class All < ApplicationService
        attr_reader :results

        def execute!
          @results = {
            drivers: drivers.success?
          }

          success!
        end

        private def drivers
          service = Drivers.new(current_user)
          service.execute!
          service
        end
      end
    end
  end
end
