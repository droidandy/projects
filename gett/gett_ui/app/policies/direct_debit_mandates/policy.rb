class DirectDebitMandates::Policy < ServicePolicy
  def execute?
    member.executive? || member.finance? || member.travelmanager?
  end
end
