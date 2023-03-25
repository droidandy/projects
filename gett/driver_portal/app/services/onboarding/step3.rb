module Onboarding
  class Step3 < BaseStep
    schema do
      required(:appointment_scheduled).filled(:bool?)
    end

    private def attributes
      gather_attributes(:appointment_scheduled, :onboarding_step)
    end

    private def required_checkboxes
      %i[appointment_scheduled]
    end

    private def step
      3
    end
  end
end
