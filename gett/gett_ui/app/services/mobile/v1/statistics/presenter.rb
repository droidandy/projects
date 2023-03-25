module Mobile::V1
  module Statistics
    class Presenter < Shared::Statistics::Presenter
      def week_stats_by_date
        last_week_dates.map{ |date| stats_for_date_or_default(date) }
      end

      private def last_week_dates
        @last_week_dates ||= 6.days.ago.to_date..Date.current
      end

      private def format_date(date)
        date.strftime
      end
    end
  end
end
