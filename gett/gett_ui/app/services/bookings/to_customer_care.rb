module Bookings
  class ToCustomerCare < ApplicationService
    include ApplicationService::ModelMethods
    include Notificator::Concern

    attributes :booking, :message

    def execute!
      return fail! unless booking.rejectable?

      notify_on_update do
        result { update_model(booking, booking_params) }
      end
    end

    private def booking_params
      {
        status: 'customer_care',
        customer_care_message: booking.customer_care_message || message,
        customer_care_at: Time.current
      }
    end
  end
end
