module Admin::Statistics
  class Index < ApplicationService
    include ApplicationService::Context
    include ApplicationService::Policy
    include ApplicationService::TimeHelpers

    def self.policy_class
      Admin::Companies::Policy
    end

    def execute!
      {
        enterprise_active_by_schedule_type: presenter(
          values: values_with_count_all_by_schedule_type(
            active: true,
            company_type: ::Company::Type::ENTERPRISE
          )
        ).stats_by_schedule_type,
        affiliate_active_by_schedule_type: presenter(
          values: values_with_count_all_by_schedule_type(
            active: true,
            company_type: ::Company::Type::AFFILIATE
          )
        ).stats_by_schedule_type,
        scheduled_by_company_type: presenter(
          values: current_day_values_with_count_all(group: 'company_type'),
          metrics: ::Company::Type::GENERAL_TYPES
        ).merged_enterprise_stats_by_metrics,
        enterprise_by_status: presenter(
          values: current_day_values_with_count_all_by_status(company_type: ::Company::Type::ENTERPRISE),
          metrics: shortened_final_statuses
        ).stats_by_metrics,
        affiliate_by_status: presenter(
          values: current_day_values_with_count_all_by_status(company_type: ::Company::Type::AFFILIATE),
          metrics: shortened_final_statuses
        ).stats_by_metrics,
        completed_by_service_type: presenter(
          values: current_day_values_with_count_all(group: 'service_type', completed: true),
          metrics: %w(gett ot)
        ).stats_by_metrics,
        international_by_status: presenter(
          values: current_day_values_with_count_all_by_status(international: true),
          metrics: shortened_final_statuses
        ).stats_by_metrics,
        cash_by_status: presenter(
          values: current_day_values_with_count_all_by_status(cash: true),
          metrics: shortened_final_statuses
        ).stats_by_metrics,
        account_by_status: presenter(
          values: current_day_values_with_count_all_by_status(account: true),
          metrics: shortened_final_statuses
        ).stats_by_metrics,
        credit_by_status: presenter(
          values: current_day_values_with_count_all_by_status(credit: true),
          metrics: shortened_final_statuses
        ).stats_by_metrics,
        bookers_by_company_type: presenter(
          values: current_day_values_by_company_type(count: 'bookers'),
          metrics: ::Company::Type::GENERAL_TYPES
        ).merged_enterprise_stats_by_metrics,
        passengers_by_company_type: presenter(
          values: current_day_values_by_company_type(count: 'passengers'),
          metrics: ::Company::Type::GENERAL_TYPES
        ).merged_enterprise_stats_by_metrics,
        companies_by_company_type: presenter(
          values: current_day_values_by_company_type(count: 'companies'),
          metrics: ::Company::Type::GENERAL_TYPES
        ).merged_enterprise_stats_by_metrics,
        first_time_passengers_by_company_type: presenter(
          values: current_day_values_with_count_all(group: 'company_type', ftr: true),
          metrics: ::Company::Type::GENERAL_TYPES
        ).merged_enterprise_stats_by_metrics,
        average_rating:     current_day_values(average_rating: true),
        affiliate_daily:    daily_stats(::Company::Type::AFFILIATE),
        affiliate_monthly:  monthly_stats(::Company::Type::AFFILIATE),
        enterprise_daily:   daily_stats(::Company::Type::ENTERPRISE),
        enterprise_monthly: monthly_stats(::Company::Type::ENTERPRISE)
      }
    end

    private def values_with_count_all_by_schedule_type(params)
      values(params.merge(count: 'all', group: 'schedule_type'))
    end

    private def current_day_values_with_count_all_by_status(params)
      current_day_values_with_count_all(params.merge(group: 'status'))
    end

    private def current_day_values_with_count_all(params)
      current_day_values(params.merge(count: 'all'))
    end

    private def current_day_values_by_company_type(params)
      current_day_values(params.merge(group: 'company_type'))
    end

    private def current_day_values(params)
      values(params.merge(for_period: current_day_period))
    end

    private def daily_stats(company_type)
      presenter(
        values: daily_values(company_type),
        metrics: all_final_statuses
      ).year_stats_by_date
    end

    private def monthly_stats(company_type)
      presenter(
        values: monthly_values(company_type),
        metrics: all_final_statuses
      ).year_stats_by_month
    end

    private def values(params)
      Admin::Statistics::BookingsQuery.new(params).values
    end

    private def presenter(*args)
      Admin::Statistics::Presenter.new(*args)
    end

    private def daily_values(company_type)
      (company_type == ::Company::Type::AFFILIATE) ? affiliate_daily_values : enterprise_daily_values
    end

    private def monthly_values(company_type)
      (company_type == ::Company::Type::AFFILIATE) ? affiliate_monthly_values : enterprise_monthly_values
    end

    private def affiliate_daily_values
      @affiliate_daily_values ||=
        last_year_values(
          group: 'date',
          company_type: ::Company::Type::AFFILIATE,
          count: { column: 'status', values: all_final_statuses }
        )
    end

    private def enterprise_daily_values
      @enterprise_daily_values ||=
        last_year_values(
          group: 'date',
          company_type: ::Company::Type::ENTERPRISE_TYPES,
          count: { column: 'status', values: all_final_statuses }
        )
    end

    private def affiliate_monthly_values
      @affiliate_monthly_values ||=
        last_year_values(
          group: 'month',
          company_type: ::Company::Type::AFFILIATE,
          count: { column: 'status', values: all_final_statuses }
        )
    end

    private def enterprise_monthly_values
      @enterprise_monthly_values ||=
        last_year_values(
          group: 'month',
          company_type: ::Company::Type::ENTERPRISE_TYPES,
          count: { column: 'status', values: all_final_statuses }
        )
    end

    private def last_year_values(params)
      values(params.merge(for_period: last_year_period))
    end

    private def all_final_statuses
      %w(completed cancelled rejected)
    end

    private def shortened_final_statuses
      %w(completed cancelled)
    end
  end
end
