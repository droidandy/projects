module Onboarding
  class Update < ApplicationService
    attr_reader :updated_user

    schema do
      required(:onboarding_step).filled(:int?)
    end

    def execute!
      unless onboarding_step.in?(0..current_user.onboarding_step)
        return fail!(errors: { onboarding_step: ['invalid'] })
      end

      compose(step_class.new(current_user, args), :updated_user)
      success! if @updated_user
    end

    private def step_class
      "::Onboarding::Step#{onboarding_step}".constantize
    end
  end
end
