using Sequel::CoreRefinements

module Bookings
  class MonthlyStats < ApplicationService
    attributes :dataset, :show_daily_spent

    def execute!
      {
        daily_orders: daily_orders,
        daily_present: daily_orders_present?,
        show_daily_spent: show_daily_spent,
        types_data: types_data
      }.tap do |hash|
        hash[:daily_spent] = daily_spent if show_daily_spent
      end
    end

    private def daily_orders
      map_daily_data{ |row| row[:count] || 0 }
    end

    private def daily_spent
      map_daily_data{ |row| row[:amount].to_f / 100 }
    end

    private def daily_orders_present?
      series_data.any?{ |row| row[:count] && row[:count] > 0 }
    end

    private def map_daily_data
      daily_data.map do |day, (prev, this)|
        prev_val = yield prev if prev
        this_val = yield this if this && !this[:date].future?

        {day: day, previous: prev_val, current: this_val}
      end
    end

    private def daily_data
      @daily_data ||=
        series_data
          .group_by{ |row| row[:day] }
          .each_value do |rows|
            if rows.one?
              if rows.first[:date].month == Date.current.month
                rows.unshift(nil)
              else
                rows.push(nil)
              end
            end
          end
    end

    private def series_data
      @series_data ||= days_series
        .left_join(bookings_by_dates.as(:bookings), :bookings[:date] => :dates[:date])
        .select{ [dates[:date].as(:date), to_char(dates[:date], 'DD').as(:day), bookings[:count], bookings[:amount]] }
        .all
    end

    private def days_series
      DB.from(Sequel.function(:generate_series, from_date.to_s.cast(:timestamp), to_date, '1 day').as(:date))
        .from_self(alias: :dates)
        .select{ [dates[:date].cast(:date).as(:date), to_char(dates[:date], 'DD').as(:day)] }
    end

    private def bookings_by_dates
      dataset
        .left_join(:booking_charges, booking_id: :bookings[:id])
        .select do
          [
            :bookings[:created_at].cast(:date).as(:date),
            count(:bookings[:id]).as(:count),
            sum(:booking_charges[:total_cost]).as(:amount)
          ]
        end
        .group{ :bookings[:created_at].cast(:date) }
    end

    private def types_data
      asap, scheduled = dataset.select{ [:bookings[:asap], count(id)] }
        .group(:asap).to_hash(:asap, :count).values_at(true, false)
      asap ||= 0
      scheduled ||= 0

      total = asap + scheduled

      asap_value = total.zero? ? 0 : asap.to_f / total
      scheduled_value = total.zero? ? 0 : scheduled.to_f / total

      {asap: asap_value, scheduled: scheduled_value, total: total}
    end

    private def from_date
      (Time.current - 1.month).beginning_of_month.to_date
    end

    private def to_date
      Time.current.end_of_month.to_date
    end
  end
end
