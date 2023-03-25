class WorkRoles::CreatePolicy < ServicePolicy
  def execute?
    member.executive?
  end
end
