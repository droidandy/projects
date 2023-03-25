module Admin
  module BookingMessages
    class Create < ApplicationService
      include ApplicationService::Policy
      include ApplicationService::ModelMethods
      include ApplicationService::Context

      attributes :booking, :phones, :text
      delegate :admin, to: :context

      def execute!
        result { create_model(booking_message, text: text) }
        notify_members if success?
      end

      def errors
        humanized_full_messages(booking_message.errors)
      end

      def booking_message
        @booking_message ||= ::BookingMessage.new(booking: booking, user: admin)
      end

      private def notify_members
        Nexmo::SMS.new(phone: phones, message: text).execute
        booking.add_change(:sms, "Passenger - #{booking.status.humanize}")
      end
    end
  end
end
