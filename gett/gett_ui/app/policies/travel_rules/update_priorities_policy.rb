class TravelRules::UpdatePrioritiesPolicy < ServicePolicy
  def execute?
    member.executive?
  end
end
