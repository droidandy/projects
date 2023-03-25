module Admin::Invoices
  class ApplyCreditNote < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Context
    include ApplicationService::Policy

    attributes :invoice

    def self.policy_class
      Admin::Invoices::Policy
    end

    def execute!
      return unless invoice.credit_note?

      update_model(invoice, applied_manually: true, paid_at: Time.now)
    end
  end
end
