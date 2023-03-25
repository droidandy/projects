class Departments::UpdatePolicy < ServicePolicy
  def execute?
    member.executive?
  end
end
