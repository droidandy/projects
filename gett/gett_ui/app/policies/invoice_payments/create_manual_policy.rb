class InvoicePayments::CreateManualPolicy < ServicePolicy
  def execute?
    member.executive? || member.finance?
  end
end
