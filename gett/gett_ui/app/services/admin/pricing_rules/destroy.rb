module Admin::PricingRules
  class Destroy < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Policy
    include ApplicationService::Context

    attributes :pricing_rule

    def self.policy_class
      Admin::Policy
    end

    def execute!
      destroy_model(pricing_rule)
    end
  end
end
