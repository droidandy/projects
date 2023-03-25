module PaymentCards
  class Destroy < ApplicationService
    include ApplicationService::Context
    include ApplicationService::Policy

    attributes :payment_card

    delegate :passenger, to: :payment_card

    def execute!
      payment_card.deactivate!
    end

    def self.policy_class
      if context&.back_office?
        ::Admin::Policy
      else
        ::PaymentCards::DestroyPolicy
      end
    end
  end
end
