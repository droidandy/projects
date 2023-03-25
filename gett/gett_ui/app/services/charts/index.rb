module Charts
  class Index < ApplicationService
    include ApplicationService::Context
    include ApplicationService::Policy
    include ApplicationService::TimeHelpers

    delegate :company, to: :context
    attributes :for_dashboard, :bookings_scope, :with_linked_companies

    def execute!
      if for_dashboard
        return {
          count_by_status_monthly: count_by_status_monthly,
          count_by_status_daily: count_by_status_daily
        }
      end

      with_linked_companies ? base_statistics.merge!(procurement_specific_statistics) : base_statistics
    end

    private def base_statistics
      {
        count_by_status_monthly:               count_by_status_monthly,
        count_by_status_daily:                 count_by_status_daily,
        count_by_vehicle_name_monthly:         count_by_vehicle_name_monthly,
        count_by_vehicle_name_daily:           count_by_vehicle_name_daily,
        spend_by_booking_type_monthly:         spend_by_booking_type_monthly,
        spend_by_booking_type_daily:           spend_by_booking_type_daily,
        spend_by_month:                        spend_by_month,
        completed_by_vehicle_name:             completed_by_vehicle_name,
        completed_by_schedule_type:            by_schedule_type_stats(values: counted_current_month_values(group: 'schedule_type')),
        month_rides_all_cities:                all_cities_stats(values: month_rides),
        month_rides_by_city:                   by_name_stats(values: counted_current_month_values(group: 'city')),
        month_spend_all_cities:                all_cities_stats(values: month_spend),
        month_spend_by_city:                   by_name_stats(values: current_month_values(group: 'city', spend: 'all')),
        month_waiting_cost_all_cities:         all_cities_stats(values: month_waiting_cost),
        month_waiting_cost_by_city:            by_name_stats(values: current_month_values(group: 'city', spend: 'waiting_cost')),
        month_avg_cost_per_vehicle_all_cities: month_avg_cost_per_vehicle,
        month_avg_cost_per_vehicle_by_city:    [current_month_values(group: 'city', spend: { column: 'average_cost_per_vehicle', values: vehicle_names })]
      }
    end

    private def procurement_specific_statistics
      {
        month_rides_all_companies:                all_companies_stats(values: month_rides),
        month_rides_by_company:                   by_name_stats(values: counted_current_month_values(group: 'company_name')),
        month_spend_all_companies:                all_companies_stats(values: month_spend),
        month_spend_by_company:                   by_name_stats(values: current_month_values(group: 'company_name', spend: 'all')),
        month_waiting_cost_all_companies:         all_companies_stats(values: month_waiting_cost),
        month_waiting_cost_by_company:            by_name_stats(values: current_month_values(group: 'company_name', spend: 'waiting_cost')),
        month_avg_cost_per_vehicle_all_companies: month_avg_cost_per_vehicle,
        month_avg_cost_per_vehicle_by_company:    [current_month_values(group: 'company_name', spend: { column: 'average_cost_per_vehicle', values: vehicle_names })]
      }
    end

    private def month_rides
      counted_current_month_values(group: 'month')
    end

    private def month_spend
      current_month_values(group: 'month', spend: 'all')
    end

    private def month_waiting_cost
      current_month_values(group: 'month', spend: 'waiting_cost')
    end

    private def month_avg_cost_per_vehicle
      current_month_values(group: 'month', spend: { column: 'average_cost_per_vehicle', values: vehicle_names })
    end

    private def count_by_status_monthly
      monthly_stats(values: monthly_values(count: { column: 'status', values: statuses }), metrics: statuses)
    end

    private def count_by_status_daily
      daily_stats(values: daily_values(count: { column: 'status', values: statuses }), metrics: statuses)
    end

    private def count_by_vehicle_name_monthly
      monthly_stats(
        values: monthly_values(completed: true, count: { column: 'vehicle_name', values: vehicle_names }),
        metrics: vehicle_names
      )
    end

    private def count_by_vehicle_name_daily
      daily_stats(
        values: daily_values(completed: true, count: { column: 'vehicle_name', values: vehicle_names }),
        metrics: vehicle_names
      )
    end

    private def spend_by_booking_type_monthly
      monthly_stats(values: monthly_values(final: true, spend: 'booking_type'), metrics: %w(phone web))
    end

    private def spend_by_booking_type_daily
      daily_stats(values: daily_values(final: true, spend: 'booking_type'), metrics: %w(phone web))
    end

    private def spend_by_month
      monthly_spend_stats(
        values: values(group: 'day', completed: true, spend: 'current_and_previous_month'),
        metrics: %w(current previous)
      )
    end

    private def completed_by_vehicle_name
      by_vehicle_name_stats(values: counted_current_month_values(group: 'vehicle_name'), metrics: vehicle_names)
    end

    private def daily_values(**args)
      values(group: 'date', for_period: last_year_period, **args)
    end

    private def monthly_values(**args)
      values(group: 'month', for_period: last_year_period, **args)
    end

    private def counted_current_month_values(**args)
      current_month_values(count: 'all', **args)
    end

    private def current_month_values(**args)
      values(completed: true, for_period: current_month_period, **args)
    end

    private def monthly_stats(*args)
      presenter(*args).year_stats_by_month
    end

    private def daily_stats(*args)
      presenter(*args).year_stats_by_date
    end

    private def monthly_spend_stats(*args)
      presenter(*args).stats_by_day
    end

    private def by_vehicle_name_stats(*args)
      presenter(*args).stats_by_metrics
    end

    private def by_schedule_type_stats(*args)
      presenter(*args).stats_by_schedule_type
    end

    private def all_cities_stats(*args)
      presenter(*args).all_stats('city')
    end

    private def all_companies_stats(*args)
      presenter(*args).all_stats('company')
    end

    private def by_name_stats(*args)
      presenter(*args).by_name_stats
    end

    private def values(params)
      company_ids = with_linked_companies ? company.linked_company_pks.push(company.id) : company.id
      Shared::Statistics::Query.new(params.merge(company_id: company_ids), scope: bookings_scope).values
    end

    private def presenter(*args)
      Shared::Statistics::Presenter.new(*args)
    end

    private def statuses
      %w(completed cancelled)
    end

    private def vehicle_names
      Bookings::Vehicle::BASE_VEHICLE_NAMES
    end
  end
end
