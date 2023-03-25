module Locations
  class Destroy < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    attributes :location
    delegate :errors, to: :location

    def self.policy_class
      Locations::Policy
    end

    def execute!
      destroy_model(location)
    end
  end
end
