module Statistics
  class Record < ApplicationService
    TYPES = %i[active_users login_count].freeze

    attr_reader :entry

    schema do
      required(:type).filled(included_in?: TYPES)
    end

    def execute!
      super do
        if (@entry = StatisticsEntry.find_by(date: Time.zone.today))
          @entry.increment! type # rubocop:disable Rails/SkipsModelValidations
        else
          compose(Gather.new(current_user, date: Time.zone.today.to_s), :entry)
        end
      end
    end
  end
end
