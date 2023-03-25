module Admin::Companies
  class Show < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context

    attributes :company

    def execute!
      company_data.merge(
        can_destroy: policy.can_destroy? && company.destroyable?,
        comments_count: company[:comments_count],
        inactive_members_count: company.members_dataset.where(active: false).count,
        count: company.members_dataset.count
      )
    end

    private def company_data
      company.as_json(
        only: [:id, :created_at, :active, :company_type, :credit_rate_status],
        include: [:name, :customer_care_password_required?, :ddi_type, :country_code]
      )
    end
  end
end
