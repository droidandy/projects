module Admin::Companies
  class Destroy < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Policy
    include ApplicationService::Context

    attributes :company

    delegate :errors, to: :company

    def execute!
      return unless company.destroyable?

      result { destroy_model(company) }
    end
  end
end
