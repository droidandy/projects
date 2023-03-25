class Bookers::CreatePolicy < ServicePolicy
  def execute?
    member.executive?
  end
end
