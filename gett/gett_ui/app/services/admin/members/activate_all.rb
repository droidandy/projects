module Admin::Members
  class ActivateAll < ApplicationService
    include ApplicationService::Context
    include ApplicationService::Policy

    attributes :company

    def execute!
      DB[:members].where(company_id: company.id).update(active: true)
    end
  end
end
