module Bookings
  class ScheduleGenerator < ApplicationService
    WEEKEND_DAYS = [0, 6].freeze
    MANDATORY_KEYS = %i[preset_type recurrence_factor starting_at ending_at].freeze

    attributes :params

    def execute!
      return [] unless valid?

      schedule.all_occurrences.map(&:to_datetime)
    end

    private def valid?
      return false unless params.values_at(*MANDATORY_KEYS).all?(&:present?)
      return false if weekly? && weekdays.blank?

      true
    end

    private def schedule
      @schedule ||=
        IceCube::Schedule.new(starting_at, end_time: ending_at) do |s|
          apply_daily_rules(s) if daily?
          apply_weekly_rules(s) if weekly?
          apply_monthly_rules(s) if monthly?
        end
    end

    private def apply_daily_rules(schedule)
      schedule.add_recurrence_rule(IceCube::Rule.daily(recurrence_factor).until(ending_at))

      return unless params[:workdays_only]

      (starting_at.to_datetime..ending_at.to_datetime).each do |scheduled_at|
        schedule.add_exception_time(scheduled_at.to_time) if scheduled_at.wday.in?(WEEKEND_DAYS)
      end
    end

    private def apply_weekly_rules(schedule)
      schedule.add_recurrence_rule(
        IceCube::Rule.weekly(recurrence_factor).day(*weekdays).until(ending_at)
      )
    end

    private def apply_monthly_rules(schedule)
      schedule.add_recurrence_rule(IceCube::Rule.monthly(recurrence_factor).until(ending_at))
    end

    private def recurrence_factor
      params[:recurrence_factor].to_i
    end

    private def daily?
      params[:preset_type] == 'daily'.freeze
    end

    private def weekly?
      params[:preset_type] == 'weekly'.freeze
    end

    private def monthly?
      params[:preset_type] == 'monthly'.freeze
    end

    private def weekdays
      params[:weekdays]&.map{ |day| day.to_i - 1 }
    end

    private def starting_at
      params[:starting_at]&.to_time
    end

    private def ending_at
      params[:ending_at]&.to_time
    end
  end
end
