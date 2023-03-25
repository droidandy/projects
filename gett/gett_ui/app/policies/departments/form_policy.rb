class Departments::FormPolicy < ServicePolicy
  scope do |member|
    member.company.members_dataset
  end

  def execute?
    member.executive?
  end
end
