module StatisticsEntries
  class Daily < ApplicationPresenter
    attr_reader :entry

    def initialize(entry)
      @entry = entry
    end

    def as_json
      convert_to_json(entry, only: %i[date amount])
    end
  end
end
