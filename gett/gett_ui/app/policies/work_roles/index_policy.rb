class WorkRoles::IndexPolicy < ServicePolicy
  scope { |member| member.company.work_roles_dataset }

  def execute?
    member.executive?
  end
end
