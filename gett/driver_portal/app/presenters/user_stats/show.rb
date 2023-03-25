module UserStats
  class Show < ApplicationPresenter
    attr_reader :stats

    def initialize(stats)
      @stats = stats
    end

    def as_json
      convert_to_json(stats)
    end
  end
end
