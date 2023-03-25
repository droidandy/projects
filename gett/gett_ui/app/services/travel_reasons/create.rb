module TravelReasons
  class Create < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    attributes :travel_reason, :params
    delegate :errors, to: :travel_reason
    delegate :company, to: :context

    def execute!
      result { create_model(travel_reason, params) }
    end

    def travel_reason
      @travel_reason ||= TravelReason.new(company: company)
    end
  end
end
