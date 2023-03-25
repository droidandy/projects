module Onboarding
  class Step4 < BaseStep
    schema do
      required(:documents_uploaded).filled(:bool?)
    end

    private def attributes
      gather_attributes(:documents_uploaded, :onboarding_step)
    end

    private def required_checkboxes
      %i[documents_uploaded]
    end

    private def step
      4
    end
  end
end
