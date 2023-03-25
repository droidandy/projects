module Companies
  class Update < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    attributes :params
    delegate :errors, to: :company
    delegate :company, to: :context

    def execute!
      update_model(company, params)
    end
  end
end
