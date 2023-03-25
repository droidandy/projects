module Statistics
  class Gather < ApplicationService
    attr_reader :entry

    schema do
      required(:date).filled(:date?)
    end

    def execute!
      @entry = StatisticsEntry.find_or_initialize_by(date: date)
      @entry.update statistics_attributes

      super do
        @entry.save
      end
    end

    on_fail { errors!(entry.errors.to_h) if entry.present? }

    private def statistics_attributes
      {
        active_users: active_users,
        login_count: login_count
      }
    end

    private def active_users
      Invites::Search.new({ accepted: true, accepted_before: end_of_date }, current_user: current_user).count
    end

    private def login_count
      Logins::Search.new(created_between: [beginning_of_date, end_of_date]).count
    end

    private def beginning_of_date
      Date.parse(date).beginning_of_day
    end

    private def end_of_date
      Date.parse(date).end_of_day
    end
  end
end
