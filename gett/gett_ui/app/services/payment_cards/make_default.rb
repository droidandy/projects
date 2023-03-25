module PaymentCards
  class MakeDefault < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Context
    include ApplicationService::Policy

    attributes :payment_card

    delegate :passenger, to: :payment_card

    def self.policy_class
      if context&.back_office?
        ::Admin::Policy
      else
        ::PaymentCards::Policy
      end
    end

    def execute!
      transaction do
        passenger.payment_cards_dataset.update(default: false)
        result { payment_card.make_default! }
      end
    end
  end
end
