module Shared::Bookings
  class Cancel < ApplicationService
    include ApplicationService::ModelMethods
    include ::Bookings::Notificator::Concern

    attributes :booking, :params, :cancelled_by, :cancelled_through_back_office

    def execute!
      return false unless booking.cancellable?

      if booking_not_requested_yet? || splyt_customer_care?
        transaction do
          success!
          booking.lock!
          update_booking(cancellation_requested_at: Time.current)
        end
        return true
      end

      api_service.execute do |on|
        on.success do
          notify_on_update do
            transaction do
              booking.lock!
              result { update_booking(cancelled_at: Time.current) }
            end
          end
          ::Bookings::FutureBookingsNotifier.new(booking: booking).execute
          BookingsChargesUpdater.perform_async(booking.id)
        end

        on.failure do
          fail ::Bookings::ServiceProviderError, "Cannot cancel booking via #{api_service.class.parent} API"
        end
      end
    end

    def booking_data
      Bookings::Show.new(booking: booking).execute.result
    end

    private def splyt_customer_care?
      booking.splyt? && booking.customer_care?
    end

    private def update_booking(params = {})
      update_model(booking, cancellation_params, params) do |b|
        b.suppress_recurring! if cancel_schedule?
      end
    end

    private def cancellation_params
      params.except(:cancel_schedule).merge(
        status: 'cancelled',
        cancelled_by: cancelled_by,
        status_before_cancellation: booking.status,
        cancelled_through_back_office: cancelled_through_back_office
      )
    end

    private def cancel_schedule?
      params[:cancel_schedule]
    end

    private def booking_not_requested_yet?
      (booking.creating? || booking.customer_care?) && booking.service_id.nil?
    end

    private def api_service
      @api_service ||= Bookings.service_for(booking, :cancel)
    end
  end
end
