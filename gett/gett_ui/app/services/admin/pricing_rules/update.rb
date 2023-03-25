module Admin::PricingRules
  class Update < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Policy
    include ApplicationService::Context

    attributes :pricing_rule, :params
    delegate :errors, to: :pricing_rule

    def self.policy_class
      Admin::Policy
    end

    def execute!
      transaction do
        result { update_model(pricing_rule, pricing_rule_params) }
        next if pricing_rule.rule_type&.area?

        assert { assign_address(pricing_rule, params[:pickup_address], key: :pickup_address_id) }
        assert { assign_address(pricing_rule, params[:destination_address], key: :destination_address_id) }
      end
    end

    private def pricing_rule_params
      params.except(:pickup_address, :destination_address).merge(
        pickup_point: params[:pickup_address]&.slice(:lat, :lng),
        destination_point: params[:destination_address]&.slice(:lat, :lng)
      )
    end
  end
end
