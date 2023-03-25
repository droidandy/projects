module Admin::PredefinedAddresses
  class Destroy < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Policy
    include ApplicationService::Context

    attributes :predefined_address
    delegate :errors, to: :predefined_address

    def self.policy_class
      Admin::Settings::Policy
    end

    def execute!
      destroy_model(predefined_address)
    end
  end
end
