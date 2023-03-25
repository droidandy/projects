module Admin::Bookings
  class ResendOrder < ApplicationService
    include ApplicationService::Context
    include ApplicationService::ModelMethods

    attributes :booking
    delegate :company, to: :context

    def execute!
      result { update_model(booking, status: 'creating') }
      assert { Splyt::UpdateEstimate.new(booking: booking).execute.success? } if booking.splyt?

      if success?
        CreateBookingRequestWorker.perform_async(booking.id)
        Faye.bookings.notify_create(booking) if company.affiliate?
      end
    end
  end
end
