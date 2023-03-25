module Onboarding
  class Step0 < BaseStep
    schema do
      required(:email).filled(:str?)
      required(:first_name).filled(:str?)
      required(:last_name).filled(:str?)
      required(:phone).filled(:str?)
      required(:license_number).filled(:str?)
      optional(:how_did_you_hear_about).maybe(:str?)
    end

    private def attributes
      {
        name: [first_name, last_name].join(' '),
        email: email,
        phone: phone,
        license_number: license_number,
        how_did_you_hear_about: how_did_you_hear_about,
        onboarding_step: onboarding_step
      }
    end

    private def step
      0
    end
  end
end
