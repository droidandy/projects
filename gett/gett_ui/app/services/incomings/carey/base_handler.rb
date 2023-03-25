module Incomings
  module Carey
    class BaseHandler < ApplicationService
      include ApplicationService::ModelMethods

      attributes :payload

      private def service_id
        payload.fetch(:res_num)
      end

      private def booking
        @booking ||= Booking.first(service_id: service_id) || fail_with_exception!("booking '#{service_id}' not found")
      end

      private def incoming
        @incoming ||= Incoming.new(service_type: Bookings::Providers::CAREY, payload: payload, booking: booking)
      end

      private def fail_with_exception!(details = nil)
        fail WebhookFailedError, ["Carey webhook #{self.class.name.demodulize} failed", details].compact.join(': ')
      end
    end
  end
end
