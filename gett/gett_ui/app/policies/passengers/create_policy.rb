class Passengers::CreatePolicy < ServicePolicy
  delegate :add_payment_cards?, :delete_payment_cards?, :change_payroll?, :change_cost_centre?, to: :form_policy

  def execute?
    member.executive?
  end

  private def form_policy
    policy(:form)
  end
end
