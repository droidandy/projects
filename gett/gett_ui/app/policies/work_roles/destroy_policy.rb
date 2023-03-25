class WorkRoles::DestroyPolicy < ServicePolicy
  def execute?
    member.executive?
  end
end
