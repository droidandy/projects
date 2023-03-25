class TravelReasons::CreatePolicy < ServicePolicy
  def execute?
    member.executive?
  end
end
