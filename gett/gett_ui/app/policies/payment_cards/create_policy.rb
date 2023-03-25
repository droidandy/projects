module PaymentCards
  class CreatePolicy < ServicePolicy
    delegate :passenger, to: :service

    def execute?
      company_has_correct_payment_type? &&
        (member.executive? || passenger&.id == member.id || assign_self?)
    end

    private def company_has_correct_payment_type?
      (member.company.payment_types &
        PaymentOptions::PaymentType::PASSENGER_PAYMENT_CARD_TYPES).present?
    end

    private def assign_self?
      policy(Passengers::FormPolicy).assign_self?
    end
  end
end
