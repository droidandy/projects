module TravelReasons
  class Destroy < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    attributes :travel_reason

    delegate :errors, to: :travel_reason

    def execute!
      destroy_model(travel_reason)
    end
  end
end
