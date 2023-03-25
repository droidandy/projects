module TravelReasons
  class Update < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    attributes :travel_reason, :params
    delegate :errors, to: :travel_reason

    def execute!
      result { update_model(travel_reason, params) }
    end
  end
end
