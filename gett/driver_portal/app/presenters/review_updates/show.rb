module ReviewUpdates
  class Show < ApplicationPresenter
    attr_reader :review_update

    def initialize(review_update)
      @review_update = review_update
    end

    COLUMNS_TO_SHOW = %i[
      id
      created_at
      comment
      completed
      current
      requirement
      review_id
    ].freeze

    def as_json
      convert_to_json(review_update, only: COLUMNS_TO_SHOW) do |json|
        json[:reviewer] = review_update.reviewer.as_json(only: %i[id first_name last_name])
      end
    end
  end
end
