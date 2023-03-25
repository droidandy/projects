module Admin::Statistics
  class Company < ApplicationService
    include ApplicationService::Context
    include ApplicationService::TimeHelpers

    attributes :company

    def execute!
      {
        count_by_status_monthly:       count_by_status_monthly,
        count_by_status_daily:         count_by_status_daily,
        count_by_vehicle_name_monthly: count_by_vehicle_name_monthly,
        count_by_vehicle_name_daily:   count_by_vehicle_name_daily,
        spend_monthly:                 monthly_stats(values: monthly_values(spend: 'all'), metrics: %w(spend)),
        spend_daily:                   daily_stats(values: daily_values(spend: 'all'), metrics: %w(spend)),
        count_by_payment_type_monthly: count_by_payment_type_monthly,
        count_by_payment_type_daily:   count_by_payment_type_daily,
        completed_by_order_type:       completed_by_order_type,
        outstanding_balance:           company.outstanding_balance,
        credit_rate_monthly:           monthly_stats(values: credit_rate_monthly, metrics: %w(value)),
        credit_rate_daily:             daily_stats(values: credit_rate_daily, metrics: %w(value))
      }
    end

    private def credit_rate_daily
      credit_rate_values(group: 'date', for_period: last_year_period, value: 'all')
    end

    private def credit_rate_monthly
      credit_rate_values(group: 'month', for_period: last_year_period, value: 'all')
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

    private def count_by_payment_type_monthly
      monthly_stats(
        values: monthly_values(completed: true, count: { column: 'payment_method', values: payment_methods }),
        metrics: payment_methods
      )
    end

    private def count_by_payment_type_daily
      daily_stats(
        values: daily_values(completed: true, count: { column: 'payment_method', values: payment_methods }),
        metrics: payment_methods
      )
    end

    private def completed_by_order_type
      presenter(
        values: values(completed: true, group: 'schedule_type', count: 'all', for_period: current_month_period)
      ).stats_by_schedule_type
    end

    private def daily_values(**args)
      values(group: 'date', for_period: last_year_period, **args)
    end

    private def monthly_values(**args)
      values(group: 'month', for_period: last_year_period, **args)
    end

    private def counted_values(**args)
      values(completed: true, count: 'all', for_period: current_month_period, **args)
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

    private def values(**args)
      Admin::Statistics::BookingsQuery.new(company_id: company.id, **args).values
    end

    private def credit_rate_values(**args)
      Admin::Statistics::CompanyCreditRatesQuery.new(company_id: company.id, **args).values
    end

    private def presenter(*args)
      Admin::Statistics::Presenter.new(*args)
    end

    private def statuses
      %w(completed cancelled rejected)
    end

    private def payment_methods
      %w(company_payment_card business_payment_card personal_payment_card account cash)
    end

    private def vehicle_names
      ::Bookings::Vehicle::BASE_VEHICLE_NAMES
    end
  end
end
