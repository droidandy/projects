module TravelRules
  class Update < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    attributes :travel_rule, :params
    delegate :errors, to: :travel_rule

    def execute!
      update_model(travel_rule, params)
    end
  end
end
