module TravelRules
  class Destroy < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    attributes :travel_rule

    delegate :errors, to: :travel_rule

    def execute!
      destroy_model(travel_rule)
    end
  end
end
