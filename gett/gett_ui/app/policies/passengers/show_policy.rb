class Passengers::ShowPolicy < ServicePolicy
  delegate :passenger, to: :service

  def execute?
    member.company.bbc? ||
      member.executive? ||
      member.finance? ||
      member.id == passenger.id ||
      member.booker? && (
        member_passenger_pks.include?(passenger.id) || passenger.booker_pks.empty?
      )
  end

  def be_expanded?
    return true unless member.company.bbc?

    member.executive? || member.id == passenger.id
  end

  private def member_passenger_pks
    RequestStore.store[:current_member_passenger_pks] ||= member.passenger_pks
  end
end
