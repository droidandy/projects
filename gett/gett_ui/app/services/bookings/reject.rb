module Bookings
  class Reject < ApplicationService
    include ApplicationService::ModelMethods
    include Notificator::Concern

    attributes :booking

    def execute!
      return fail! unless booking.rejectable?

      notify_on_update do
        result { update_model(booking, status: 'rejected', rejected_at: Time.current) }
        Bookings::FutureBookingsNotifier.new(booking: booking).execute
      end
    end
  end
end
