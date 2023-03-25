module StatisticsEntries
  class Index < ApplicationPresenter
    attr_reader :entries

    def initialize(entries)
      @entries = entries
    end

    def daily
      {
        entries: @entries.map { |entry| StatisticsEntries::Daily.new(entry).as_json }
      }
    end

    def monthly
      {
        entries: @entries.map { |entry| StatisticsEntries::Monthly.new(entry).as_json }
      }
    end
  end
end
