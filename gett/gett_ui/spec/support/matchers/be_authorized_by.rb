RSpec::Matchers.define :be_authorized_by do |policy_class|
  match do
    described_class.try(:policy_class) == policy_class
  end

  failure_message do
    "Expected #{described_class} to be be authorized by #{policy_class}, ".tap do |message|
      message <<
        if described_class < ApplicationService::Policy
          "but it is authorized by #{described_class.policy_class}"
        else
          "but it does't even include ApplicationService::Policy"
        end
    end
  end
end
