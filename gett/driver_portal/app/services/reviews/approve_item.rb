module Reviews
  class ApproveItem < Base
    schema do
      required(:driver_id).filled(:int?)
      required(:requirement).filled(:str?)
      optional(:gett_phone).maybe(:str?)
    end

    def execute!
      find_review
      authorize!(review)
      check_requirement
      return if errors?

      Review.transaction do
        driver.update!(gett_phone: gett_phone) if gett_phone.present?

        review.review_updates
          .public_send(requirement)
          .each { |record| record.update!(current: false) }

        @review_update = ReviewUpdate.create!(
          review: review,
          requirement: requirement,
          reviewer: current_user,
          completed: true
        )
      end
      success!
    end
  end
end
