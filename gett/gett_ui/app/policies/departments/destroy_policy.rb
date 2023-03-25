class Departments::DestroyPolicy < ServicePolicy
  def execute?
    member.executive?
  end
end
