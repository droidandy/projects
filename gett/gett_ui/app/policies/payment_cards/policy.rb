module PaymentCards
  class Policy < ServicePolicy
    delegate :passenger, to: :service

    def execute?
      member.executive? || passenger&.id == member.id || assign_self?
    end

    private def assign_self?
      policy(Passengers::FormPolicy).assign_self?
    end
  end
end
