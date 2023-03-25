module Bookings
  class Cancel < ApplicationService
    include ApplicationService::Context
    include ApplicationService::Policy

    attributes :booking, :params
    delegate :member, :reincarnated?, :original_user, to: :context

    def execute!
      delegate_execution_to cancel_service
    end

    def booking_data
      Bookings::Show.new(booking: booking).execute.result
    end

    private def cancelled_by
      reincarnated? ? original_user : member
    end

    private def cancel_service
      @cancel_service ||= Shared::Bookings::Cancel.new(
        booking: booking,
        params: params,
        cancelled_by: cancelled_by,
        cancelled_through_back_office: reincarnated?
      )
    end
  end
end
