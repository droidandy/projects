module Admin::PredefinedAddresses
  class Create < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Policy
    include ApplicationService::Context

    attributes :params
    delegate :errors, to: :predefined_address

    def self.policy_class
      Admin::Settings::Policy
    end

    def execute!
      create_model(predefined_address, params)
    end

    def predefined_address
      @predefined_address ||= PredefinedAddress.new
    end

    def show_result
      predefined_address.as_json
    end
  end
end
