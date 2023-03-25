class Members::InviteAllPolicy < ServicePolicy
  def execute?
    member.executive?
  end
end
