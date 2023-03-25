module DirectDebitMandates
  class Show < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context

    delegate :company, to: :context

    def self.policy_class
      DirectDebitMandates::Policy
    end

    def execute!
      company.direct_debit_mandate
    end
  end
end
