module CompanyPaymentCards
  class Show < ApplicationService
    include ApplicationService::Policy
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    delegate :company, to: :context

    def self.policy_class
      CompanyPaymentCards::Policy
    end

    def execute!
      return {} if company.payment_card.blank?

      company.payment_card.as_json(only: %i(
        holder_name
        last_4
        expiration_month
        expiration_year
      ))
    end
  end
end
