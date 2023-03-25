class WorkRoles::UpdatePolicy < ServicePolicy
  def execute?
    member.executive?
  end
end
