module Onboarding
  class Step2 < BaseStep
    schema do
      required(:sort_code).filled(:str?)
      required(:account_number).filled(:str?)
      required(:city).filled(:str?)
      required(:postcode).filled(:str?)
      required(:address).filled(:str?)
      required(:insurance_number).filled(:str?)
      required(:insurance_number_agreement).filled(:bool?)
      required(:documents_agreement).filled(:bool?)
    end

    private def attributes
      gather_attributes(
        :account_number,
        :address,
        :city,
        :documents_agreement,
        :insurance_number_agreement,
        :insurance_number,
        :onboarding_step,
        :postcode,
        :sort_code
      )
    end

    private def required_checkboxes
      %i[insurance_number_agreement documents_agreement]
    end

    private def step
      2
    end
  end
end
