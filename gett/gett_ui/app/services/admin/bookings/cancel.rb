module Admin::Bookings
  class Cancel < ApplicationService
    include ApplicationService::Context

    attributes :booking, :params
    delegate :admin, to: :context

    def execute!
      delegate_execution_to cancel_service
    end

    def booking_data
      Admin::Bookings::Show.new(booking: booking).execute.result
    end

    private def cancel_service
      @cancel_service ||= Shared::Bookings::Cancel.new(
        booking: booking,
        params: params,
        cancelled_by: admin,
        cancelled_through_back_office: true
      )
    end
  end
end
