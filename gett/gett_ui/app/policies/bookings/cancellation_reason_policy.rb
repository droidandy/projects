class Bookings::CancellationReasonPolicy < ServicePolicy
  delegate :booking, to: :service

  def execute?
    member.id == booking.passenger_id || member.id == booking.booker_id
  end
end
