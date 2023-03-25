class Messages::CreateInternalPolicy < ServicePolicy
  def execute?
    member.companyadmin?
  end
end
