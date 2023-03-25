module System
  module Check
    module EarningsApi
      class All < ApplicationService
        attr_reader :results

        def execute!
          @results = {
            earnings: earnings.success?
          }

          success!
        end

        private def earnings
          service = Earnings.new(current_user)
          service.execute!
          service
        end
      end
    end
  end
end
