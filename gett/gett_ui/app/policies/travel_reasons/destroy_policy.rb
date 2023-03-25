class TravelReasons::DestroyPolicy < ServicePolicy
  def execute?
    member.executive?
  end
end
