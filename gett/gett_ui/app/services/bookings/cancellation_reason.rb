module Bookings
  class CancellationReason < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::Context
    include ApplicationService::Policy

    attributes :booking, :reason

    def execute!
      return unless booking.cancelled?

      result { update_model(booking, cancellation_reason: reason) }
    end
  end
end
