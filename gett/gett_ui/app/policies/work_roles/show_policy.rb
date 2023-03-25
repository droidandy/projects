class WorkRoles::ShowPolicy < ServicePolicy
  def execute?
    member.executive?
  end
end
