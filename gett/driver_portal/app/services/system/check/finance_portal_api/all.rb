module System
  module Check
    module FinancePortalApi
      class All < ApplicationService
        attr_reader :results

        def execute!
          @results = {
            driver_stats: driver_stats.success?,
            order: order.success?,
            statement_html: statement_html.success?,
            statements: statements.success?
          }

          success!
        end

        private def driver_stats
          service = DriverStats.new(current_user)
          service.execute!
          service
        end

        private def order
          service = Order.new(current_user)
          service.execute!
          service
        end

        private def statement_html
          service = StatementHTML.new(current_user)
          service.execute!
          service
        end

        private def statements
          service = Statements.new(current_user)
          service.execute!
          service
        end
      end
    end
  end
end
