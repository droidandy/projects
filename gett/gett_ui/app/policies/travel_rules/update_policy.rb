class TravelRules::UpdatePolicy < ServicePolicy
  def execute?
    member.executive?
  end
end
