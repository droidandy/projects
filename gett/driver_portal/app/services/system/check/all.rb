module System
  module Check
    class All < ApplicationService
      attr_reader :results

      def execute!
        compose(EarningsApi::All.new, :results, as: :earnings, pass_errors: false)
        compose(FleetApi::All.new, :results, as: :fleet, pass_errors: false)
        compose(System::Check::FinancePortalApi::All.new, :results, as: :finance_portal, pass_errors: false)

        @results = {
          earnings: @earnings,
          fleet: @fleet,
          finance_portal: @finance_portal
        }

        success!
      end
    end
  end
end
