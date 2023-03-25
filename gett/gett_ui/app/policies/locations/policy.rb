class Locations::Policy < ServicePolicy
  def execute?
    member.executive?
  end
end
