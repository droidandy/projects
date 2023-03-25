class PushSender < ApplicationWorker
  sidekiq_options queue: :default, retry: false

  def perform(devices, message, back_up_with_sms)
    sender = Firebase::CloudMessaging.new(devices: devices, message: message)

    if !sender.execute.success? && back_up_with_sms
      booking_id = message.dig(:data, :booking_id)
      notify_with_sms(Booking[booking_id]) if booking_id.present?
    end
  end

  private def notify_with_sms(booking)
    Bookings::NotifyPassenger.new(booking: booking, only: :sms, force: true).execute
  end
end
