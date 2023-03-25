module ApplicationService::TimeHelpers
  DEFAULT_TIMEZONE = 'Europe/London'.freeze

  private def end_of_current_date_in_tz(timezone = DEFAULT_TIMEZONE)
    Date.current.in_time_zone(timezone).end_of_day.utc
  end

  private def current_day_period(timezone = DEFAULT_TIMEZONE)
    Date.current.in_time_zone(timezone).utc..end_of_current_date_in_tz(timezone)
  end

  private def current_month_period(timezone = DEFAULT_TIMEZONE)
    Date.current.in_time_zone(timezone).beginning_of_month.utc..end_of_current_date_in_tz(timezone)
  end

  private def last_year_period(timezone = DEFAULT_TIMEZONE)
    11.months.ago.in_time_zone(timezone).beginning_of_month.utc..end_of_current_date_in_tz(timezone)
  end

  private def last_week_period(timezone = DEFAULT_TIMEZONE)
    6.days.ago.in_time_zone(timezone).beginning_of_day.utc..end_of_current_date_in_tz(timezone)
  end

  private def seconds_to_hms(seconds)
    # method converts seconds integer to 'hh:mm:ss' format string

    hrs, rest = seconds.divmod(3600)
    mins, secs = rest.divmod(60)

    # rubocop says to prefer format over String#% method, however ApplicationService::DocumentRenderer
    # already uses 'format' attribute, what causes naming collision when using it together with current module
    '%02d:%02d:%02d' % [hrs, mins, secs] # rubocop:disable Style/FormatString
  end

  private def interval_to_hms(start_timestamp, end_timestamp)
    seconds =
      if end_timestamp.present? && start_timestamp.present?
        (end_timestamp - start_timestamp) * 1.day
      end

    seconds_to_hms(seconds.to_i)
  end
end
