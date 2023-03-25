module Admin::Companies
  class ToggleStatus < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Context
    include ApplicationService::Policy

    attributes :company

    def execute!
      update_model(company, active: !company.active?)
    end
  end
end
