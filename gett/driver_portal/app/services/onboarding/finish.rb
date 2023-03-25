module Onboarding
  class Finish < BaseStep
    def execute!
      success! if compose(
        ::Users::Update.new(
          current_user,
          onboarding_step: User::ONBOARDING_STEPS.last,
          user: current_user
        )
      )
    end
  end
end
