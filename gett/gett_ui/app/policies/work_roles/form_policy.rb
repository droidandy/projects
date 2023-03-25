class WorkRoles::FormPolicy < ServicePolicy
  scope do |member|
    member
      .company
      .members_dataset
      .where(member_role_id: [Role[:passenger].id, Role[:booker].id])
  end

  def execute?
    member.executive?
  end
end
