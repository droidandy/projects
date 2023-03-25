module StatisticsEntries
  class Search < ApplicationQuery
    YEAR = "date_part('year', date)".freeze
    MONTH = "date_part('month', date)".freeze

    base_scope { StatisticsEntry.all }

    query_by(:from, :to) do |from, to|
      scope.where('date BETWEEN ? AND ?', from, to)
    end

    sifter :daily do
      base_scope { |scope| scope.order('date') }

      query_by(:type) { |type| scope.select("#{type} as amount, date") }
    end

    sifter :monthly do
      base_scope do |scope|
        scope.group("#{YEAR}, #{MONTH}").order("#{YEAR}, #{MONTH}")
      end

      query_by(type: 'active_users') { scope.select("MAX(active_users) as amount, #{YEAR} as year, #{MONTH} as month") }
      query_by(type: 'login_count') { scope.select("SUM(login_count) as amount, #{YEAR} as year, #{MONTH} as month") }
    end

    def daily(type)
      resolved_scope(:daily, type: type)
    end

    def monthly(type)
      resolved_scope(:monthly, type: type)
    end
  end
end
