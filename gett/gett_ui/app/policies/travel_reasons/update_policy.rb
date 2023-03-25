class TravelReasons::UpdatePolicy < ServicePolicy
  def execute?
    member.executive?
  end
end
