class Bookings::CancelPolicy < ServicePolicy
  delegate :booking, to: :service
  delegate :passenger, to: :booking

  def execute?
    member.executive? || available_for_booker? || available_for_passenger?
  end

  private def available_for_booker?
    return unless member.booker?

    member.id == booking.booker_id ||
      (passenger.present? && (
        passenger.bookers.empty? || passenger.booker_pks.include?(member.id)
      ))
  end

  private def available_for_passenger?
    member.passenger? && member.id == booking.passenger_id
  end
end
