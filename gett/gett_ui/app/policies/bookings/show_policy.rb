class Bookings::ShowPolicy < ServicePolicy
  delegate :booking, to: :service

  def execute?
    member.executive? || member.finance? || available_for_booker? || available_for_passenger?
  end

  private def available_for_booker?
    return unless member.booker?

    booking.passenger_id == member.id ||
      member.passenger_pks.include?(booking.passenger_id) ||
      (booking.booker_id == member.id && (!booking.company.bbc? || booking.passenger_id.nil?))
  end

  private def available_for_passenger?
    member.passenger? && member.id == booking.passenger_id
  end
end
