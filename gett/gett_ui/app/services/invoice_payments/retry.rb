module InvoicePayments
  class Retry < ApplicationService
    include ApplicationService::Context
    include ApplicationService::Policy

    delegate :company, to: :context

    def self.policy_class
      InvoicePayments::CreateManualPolicy
    end

    def execute!
      InvoicePayments::CreateAutomatic.new(company: company).execute.success?
    end
  end
end
