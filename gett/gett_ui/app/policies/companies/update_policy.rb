class Companies::UpdatePolicy < ServicePolicy
  def execute?
    member.executive?
  end
end
