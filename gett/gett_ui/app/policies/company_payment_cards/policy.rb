class CompanyPaymentCards::Policy < ServicePolicy
  def execute?
    member.executive? || member.finance?
  end
end
