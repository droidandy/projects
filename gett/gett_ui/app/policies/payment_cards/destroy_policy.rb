module PaymentCards
  class DestroyPolicy < Policy
    delegate :payment_card, to: :service

    def execute?
      !payment_card.default? && super
    end
  end
end
