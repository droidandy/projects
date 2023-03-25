module StatisticsEntries
  class Monthly < ApplicationPresenter
    attr_reader :entry

    def initialize(entry)
      @entry = entry
    end

    def as_json
      convert_to_json(entry, only: %i[amount]) do |json|
        json[:year] = @entry.year.to_i
        json[:month] = @entry.month.to_i
      end
    end
  end
end
