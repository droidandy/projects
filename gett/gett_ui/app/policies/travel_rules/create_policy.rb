class TravelRules::CreatePolicy < ServicePolicy
  def execute?
    member.executive?
  end
end
