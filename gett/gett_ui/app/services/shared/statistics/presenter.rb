class Shared::Statistics::Presenter
  MONTH_FORMAT = '%b, %Y'.freeze
  DATE_FORMAT = '%e'.freeze

  private_constant :MONTH_FORMAT, :DATE_FORMAT

  attr_reader :values, :metrics

  def initialize(values: nil, metrics: nil)
    @values = values
    @metrics = metrics
  end

  def year_stats_by_month
    months_for_last_year.map{ |month| stats_for_month_or_default(month) }
  end

  def year_stats_by_date
    months_for_last_year.map do |month|
      (0...days_in_month(month)).map{ |i| stats_for_date_or_default(month + i.days) }
    end
  end

  def stats_by_day
    (1..31).map{ |day| stats_for_day_or_default(day) }
  end

  def stats_by_metrics
    metrics.map do |name|
      value = values.find{ |val| val[:name] == name }
      value.present? ? value : { name: name, value: 0 }
    end
  end

  def merged_enterprise_stats_by_metrics
    # Hack to merge bbc and enterprise results
    bbc_stats = values.find { |val| val[:name] == Company::Type::BBC }
    enterprise_stats = values.find { |val| val[:name] == Company::Type::ENTERPRISE }
    if bbc_stats && enterprise_stats
      enterprise_stats[:value] = enterprise_stats[:value] + bbc_stats[:value]
    end

    stats_by_metrics
  end

  def stats_by_schedule_type
    [true, false].map do |type|
      value = values.find{ |val| val[:name] == type }

      if value.present?
        value.merge(name: value[:name] ? 'asap' : 'future')
      else
        { name: type ? 'asap' : 'future', value: 0 }
      end
    end
  end

  def all_stats(name)
    prepared_name = "all_#{name.pluralize}".to_sym

    values.map do |value|
      value[prepared_name] = value.delete(:value) || value.delete(:spend)
      value
    end
  end

  def by_name_stats
    # nested array is needed for front-end charts component
    [[
      values.each_with_object({}) do |item, result|
        name = item[:name] || 'unknown'
        value = item[:value] || item[:spend]
        result[name] = value
      end
    ]]
  end

  private def stats_for_month_or_default(month)
    stats = values.find{ |val| same_month?(month, val[:date]) }

    if stats.present?
      stats.merge!(name: format_month(stats[:date]))
    else
      default_stats(format_month(month))
    end
  end

  private def stats_for_date_or_default(date)
    stats = values.find{ |val| same_date?(date, val[:date]) }

    if stats.present?
      stats.merge!(name: format_date(stats[:date]))
    else
      default_stats(format_date(date))
    end
  end

  private def stats_for_day_or_default(day)
    stats = values.find{ |val| day == val[:date] }

    if stats.present?
      stats.merge!(name: stats[:date])
    else
      default_stats(day)
    end
  end

  private def default_stats(name)
    (default_metrics || {}).merge!(name: name)
  end

  private def default_metrics
    metrics&.each_with_object({}) do |metric, result|
      result[metric] = 0
    end
  end

  private def same_date?(first_date, second_date)
    first_date.to_date == second_date.to_date
  end

  private def same_month?(first_date, second_date)
    first_date.to_date.beginning_of_month == second_date.to_date.beginning_of_month
  end

  private def months_for_last_year
    @months_for_last_year ||= beginning_of_months_list(Date.current - 11.months, Date.current)
  end

  private def beginning_of_months_list(start, finish)
    (start.to_date..finish.to_date).map(&:beginning_of_month).uniq
  end

  private def days_in_month(date)
    Time.days_in_month(date.month, date.year)
  end

  private def format_month(date)
    date.strftime(MONTH_FORMAT)
  end

  private def format_date(date)
    date.strftime(DATE_FORMAT)
  end
end
