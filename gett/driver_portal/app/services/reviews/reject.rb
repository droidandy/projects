module Reviews
  class Reject < Base
    schema do
      required(:driver_id).filled(:int?)
      required(:comment).filled(:str?)
    end

    def execute!
      find_review
      authorize!(review)

      super do
        review.update!(completed: false, comment: comment)

        @review_update = ReviewUpdate.create!(
          review: review,
          requirement: 'base',
          reviewer: current_user,
          completed: false,
          comment: comment
        )

        @new_review = driver.reviews.create(attempt_number: driver.reviews.count + 1)
      end
    end
  end
end
