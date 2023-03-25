module UserMetrics
  class Show < ApplicationPresenter
    attr_reader :metrics

    def initialize(metrics)
      @metrics = metrics
    end

    COLUMNS_TO_SHOW = %i[
      rating
      today_acceptance
      week_acceptance
      month_acceptance
      total_acceptance
    ].freeze

    def as_json
      convert_to_json(metrics, only: COLUMNS_TO_SHOW)
    end
  end
end
