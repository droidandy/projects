class Invoices::IndexPolicy < ServicePolicy
  def execute?
    member.executive? || member.finance?
  end
end
