module TravelRules
  class Create < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    attributes :travel_rule, :params
    delegate :errors, to: :travel_rule
    delegate :company, to: :context

    def execute!
      create_model(travel_rule, params)
    end

    def travel_rule
      @travel_rule ||= TravelRule.new(company: company)
    end
  end
end
