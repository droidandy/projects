module Reviews
  class Approve < Base
    schema do
      required(:driver_id).filled(:int?)
    end

    def execute!
      find_review
      authorize!(review)

      Review.transaction do
        review.update!(completed: true)

        @review_update = ReviewUpdate.create!(
          review: review,
          requirement: 'base',
          reviewer: current_user,
          completed: true
        )

        compose(::Onboarding::Finish.new(review.driver))
      end

      success!
    end

    on_success { SendDriverJob.perform_later(driver_id) }
  end
end
