class Bookers::ShowPolicy < ServicePolicy
  delegate :booker, to: :service

  def execute?
    member.executive? || member.id == booker.id
  end

  def be_expanded?
    return true unless member.company.bbc?

    member.executive? || member.id == booker.id
  end
end
