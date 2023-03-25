module Admin::Settings
  class UpdateDeploymentNotification < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Policy
    include ApplicationService::Context

    attributes :text

    def execute!
      update_model(DeploymentNotification.last, text: text)
    end

    def self.policy_class
      Admin::Settings::Policy
    end
  end
end
