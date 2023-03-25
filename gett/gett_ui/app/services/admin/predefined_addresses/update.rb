module Admin::PredefinedAddresses
  class Update < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Policy
    include ApplicationService::Context

    attributes :params, :predefined_address
    delegate :errors, to: :predefined_address

    def self.policy_class
      Admin::Settings::Policy
    end

    def execute!
      update_model(predefined_address, params)
    end

    def show_result
      predefined_address.as_json
    end
  end
end
