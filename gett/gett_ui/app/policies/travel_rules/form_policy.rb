class TravelRules::FormPolicy < ServicePolicy
  def execute?
    member.executive?
  end
end
