module Incomings
  module Splyt
    class BookingStatusUpdater < Base
      include ::Bookings::Notificator::Concern

      STATUS_MAPPING = {
        'driver-not-found' => :customer_care,
        'rejected'         => :customer_care,
        'confirmed'        => :order_received,
        'en-route'         => :on_the_way,
        'reassigned'       => :on_the_way,
        'arriving'         => :on_the_way,
        'arrived'          => :arrived,
        'no-show'          => :cancelled,
        'canceled'         => :cancelled,
        'on-board'         => :in_progress,
        'completed'        => :completed
      }.freeze

      private_constant :STATUS_MAPPING

      private def execute!
        super do
          next if status_not_changed?

          booking.lock!

          notify_on_update do
            update_model(booking, booking_params)

            if notifable?
              driver_info_fetcher.execute
              driver_info_updater.execute if driver_info_fetcher.success?

              unless driver_info_updater.success?
                break set_errors("Cannot update status '#{status}' for booking id: #{booking.id}. Reason: unable to fetch a driver info.")
              end
            end
          end
        end
      end

      private def validate
        errors.add(:booking, :not_found) if booking.blank?
      end

      private def status_not_changed?
        booking.status == status
      end

      private def status
        STATUS_MAPPING[payload.dig(:data, :status)]
      end

      private def notifable?
        Bookings::Notificator::NOTIFIABLE_STATUSES.include?(status.to_s)
      end

      private def driver_info_fetcher
        @driver_info_fetcher ||= ::Splyt::DriverInfo.new(booking: booking)
      end

      private def driver_info_updater
        @driver_info_updater ||= ::Bookings::DriverUpdater.new(booking: booking, params: driver_params)
      end

      private def driver_params
        driver_info_fetcher.normalized_response[:driver]
      end

      private def booking_params
        { status: status }.tap do |params|
          params[timestamp_key] = Time.current if timestamp_key.present?
        end
      end

      private def timestamp_key
        Bookings::TIMESTAMP_MAPPING[status]
      end
    end
  end
end
