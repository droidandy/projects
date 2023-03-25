class TravelRules::IndexPolicy < ServicePolicy
  def execute?
    member.executive?
  end
end
