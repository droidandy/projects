module Mobile::V1
  module Statistics
    class Show < ApplicationService
      include ApplicationService::Context
      include ApplicationService::Policy
      include ApplicationService::TimeHelpers

      delegate :company, :member, to: :context

      def execute!
        {
          daily_completed_cancelled_orders: daily_values(count: { column: 'status', values: statuses }),
          daily_cost: daily_values(spend: 'all'),
          daily_completed_orders_by_vehicle_name: daily_values(completed: true, count: { column: 'vehicle_name', values: vehicle_names }),
          daily_avg_cost_by_vehicle_name: daily_values(spend: { column: 'average_cost_per_vehicle', values: vehicle_names }),
          completed_orders_by_city: company_values(group: 'city', completed: true, count: 'all')
        }.tap do |result|
          break result unless policy.show_all_graphs?

          if company.linked_companies.any?
            result[:completed_orders_by_company] = with_linked_companies_values(group: 'company_name', completed: true, count: 'all')
          end

          result[:top_passengers] = company_values(top: 'passengers')
          result[:top_bookers] = company_values(top: 'bookers')
        end
      end

      private def daily_values(params)
        Statistics::Presenter.new(values: company_values(params.merge(group: 'date'))).week_stats_by_date
      end

      private def company_values(params)
        values(params.merge(company_id: company.id))
      end

      private def with_linked_companies_values(params)
        company_ids = company.linked_company_pks.push(company.id)
        values(params.merge(company_id: company_ids))
      end

      private def values(params)
        Statistics::Query.new(params.merge(for_period: last_week_period), scope: policy_scope).values
      end

      private def statuses
        %w(completed cancelled)
      end

      private def vehicle_names
        ::Bookings::Vehicle::BASE_VEHICLE_NAMES
      end
    end
  end
end
