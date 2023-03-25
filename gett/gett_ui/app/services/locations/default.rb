module Locations
  class Default < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    attributes :location
    delegate :errors, to: :location
    delegate :company, to: :context

    def self.policy_class
      Locations::Policy
    end

    def execute!
      transaction do
        result { company.locations_dataset.default.update(default: false) }
        assert { update_model(location, default: !location.default) } if success?
      end
    end

    def show_result
      Locations::Show.new(location: location).execute.result
    end
  end
end
