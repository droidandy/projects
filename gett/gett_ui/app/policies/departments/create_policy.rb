class Departments::CreatePolicy < ServicePolicy
  def execute?
    member.executive?
  end
end
