module ApplicationService::FutureBookingsMethods
  private def future_bookings_count
    future_bookings_dataset.count
  end

  private def closest_future_booking_id
    future_bookings_dataset.order(:scheduled_at).first&.id
  end

  private def future_bookings_dataset
    member.bookings_dataset.not_final.scheduled.where{ scheduled_at > Time.current }
  end

  private def last_active_booking_id
    member.bookings_dataset.active.order_by(:created_at).last&.id
  end
end
