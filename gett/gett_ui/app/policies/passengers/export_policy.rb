class Passengers::ExportPolicy < ServicePolicy
  scope(&Passengers::IndexPolicy.scope)

  def execute?
    return false if member.company.bbc?

    member.executive? || member.booker?
  end
end
