module Reviews
  class Show < ApplicationPresenter
    attr_reader :review

    def initialize(review)
      @review = review
    end

    COLUMNS_TO_SHOW = %i[
      id
      completed
      attempt_number
    ].freeze

    def as_json(with_updates: false)
      convert_to_json(review, only: COLUMNS_TO_SHOW) do |json|
        json[:review_updates] = review_updates if with_updates
        json[:driver] = review.driver.as_json(only: %i[id first_name last_name])
      end
    end

    private def review_updates
      review.review_updates.chronological.map do |review_update|
        ::ReviewUpdates::Show.new(review_update).as_json
      end
    end
  end
end
