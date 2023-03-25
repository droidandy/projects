module Reviews
  class Index < ApplicationPresenter
    attr_reader :reviews

    def initialize(reviews)
      @reviews = reviews
    end

    def as_json
      {
        reviews: reviews.map { |review| presenter_for(review).as_json(with_updates: true) }
      }
    end
  end
end
