module Reviews
  class Base < ApplicationService
    REQUIREMENTS = (ReviewUpdate.requirements.keys - %w[base]).freeze

    attr_reader :review, :review_update

    private def driver
      @driver ||= User.find(driver_id)
    end

    private def find_review
      @review = driver.reviews.in_progress.first || raise(ActiveRecord::RecordNotFound)
    end

    private def check_requirement
      return if requirement.in?(REQUIREMENTS)
      fail!(errors: { requirement: 'is invalid' })
    end
  end
end
