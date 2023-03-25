module Bookings
  class PushNotification < ApplicationService
    BOOKING_STATUS_CHANGE = 'booking_status_change'.freeze
    FLIGHT_STATUS_CHANGE  = 'flight_status_change'.freeze

    attributes :kind, :booking, :back_up_with_sms
    attributes :flight_status # used only for FLIGHT_STATUS_CHANGE kind

    delegate :passenger, to: :booking

    def execute!
      return if passenger&.user_devices_dataset&.active.blank?

      Messages::CreatePush.new(recipient: passenger, push_data: message).execute
      PushSender.perform_async(passenger.user_devices_dataset.active.select_map(:token), message, back_up_with_sms)

      success!
    end

    private def message
      {
        data: {
          kind: kind,
          booking_id: booking.id
        },
        notification: {
          body: notification_body,
          sound: 'default'
        }
      }
    end

    private def notification_body
      case kind
      when BOOKING_STATUS_CHANGE
        I18n.t("booking.push_notifications.#{booking.status}", order_id: booking.order_id)
      when FLIGHT_STATUS_CHANGE
        I18n.t("booking.push_notifications.#{flight_status}")
      end
    end
  end
end
