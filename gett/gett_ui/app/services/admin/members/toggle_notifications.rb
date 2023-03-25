module Admin::Members
  class ToggleNotifications < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Context
    include ApplicationService::Policy

    attributes :company, :params

    ALLOWED_FIELDS = %i(
      notify_with_email
      notify_with_sms
      notify_with_push
    ).freeze

    def execute!
      return fail! unless ALLOWED_FIELDS | params.keys.map(&:to_sym) == ALLOWED_FIELDS

      DB[:members].where(company_id: company.id).update(params.to_h)
      success!
    end
  end
end
