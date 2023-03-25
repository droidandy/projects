module Admin::Companies
  class Disable < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Context
    include ApplicationService::Policy

    attributes :company

    def self.policy_class
      Admin::Companies::ToggleStatusPolicy
    end

    def execute!
      update_model(company, active: false)
    end
  end
end
