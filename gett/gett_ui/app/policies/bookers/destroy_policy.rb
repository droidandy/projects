class Bookers::DestroyPolicy < ServicePolicy
  def execute?
    member.executive? && !service.booker.companyadmin?
  end
end
