module Reviews
  class RejectItem < Base
    schema do
      required(:driver_id).filled(:int?)
      required(:requirement).filled(:str?)
      required(:comment).filled(:str?)
    end

    def execute!
      find_review
      authorize!(review)
      check_requirement
      return if errors?

      Review.transaction do
        review.review_updates
          .public_send(requirement)
          .each { |record| record.update!(current: false) }

        @review_update = ReviewUpdate.create!(
          review: review,
          requirement: requirement,
          reviewer: current_user,
          completed: false,
          comment: comment
        )
      end
      success!
    end
  end
end
