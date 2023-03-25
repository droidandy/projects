class Departments::ShowPolicy < ServicePolicy
  def execute?
    member.executive?
  end
end
