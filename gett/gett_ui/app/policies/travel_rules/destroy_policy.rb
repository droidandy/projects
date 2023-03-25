class TravelRules::DestroyPolicy < ServicePolicy
  def execute?
    member.executive?
  end
end
