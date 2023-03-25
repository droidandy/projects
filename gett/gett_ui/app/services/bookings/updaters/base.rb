module Bookings
  module Updaters
    class Base < ApplicationService
      include ApplicationService::ModelMethods
      include Notificator::Concern

      KEEPALIVE_DURATION = 1.day
      private_constant :KEEPALIVE_DURATION

      attributes :booking

      def execute!
        return reject_booking! if reject_booking?

        request_api_service

        begin
          notify_on_update do
            if api_service.success?
              result { update_model(booking, update_params, validate: false) }
              Bookings::DriverUpdater.new(booking: booking, params: driver_params).execute if success?
              Bookings::FutureBookingsNotifier.new(booking: booking).execute if booking.completed?
            end

            update_model(booking, status: :processing) if booking_is_stuck?
          end

          update_booking_charges if booking.billable?
        rescue Sequel::NoExistingObject
          # booking was updated during status request. thus, discarding any results
          return false
        end
      end

      private def update_params
        booking_params.tap do |params|
          status = params[:status]&.to_sym
          if status.present? && status != booking.status.to_sym && Bookings::TIMESTAMP_MAPPING[status].present?
            params[Bookings::TIMESTAMP_MAPPING[status]] = Time.current
          end
        end
      end

      private def driver_params
        api_service.normalized_response[:driver]
      end

      private def booking_is_stuck?
        booking.order_received? && (
            (booking.asap? && 5.minutes.since(booking.created_at).past?) ||
            (booking.future? && 15.minutes.ago(booking.scheduled_at).past?)
        )
      end

      private def reject_booking?
        !Rails.env.production? && booking.rejectable? && KEEPALIVE_DURATION.since(booking.scheduled_at).past?
      end

      private def reject_booking!
        Bookings::Reject.new(booking: booking).execute.result
      end

      private def update_booking_charges
        BookingsChargesUpdater.perform_async(booking.id)
      end
    end
  end
end
