module Bookings
  class Notificator < ApplicationService
    module Concern
      private def notify_on_update
        Notificator.new(booking: booking).execute do
          yield
        end
      end
    end

    NOTIFIABLE_STATUSES = ['order_received', 'on_the_way', 'arrived', 'cancelled'].freeze

    attributes :booking

    attr_reader :old_key_values

    def execute!
      @old_key_values = key_values

      yield

      booking.reload # just to be sure there's no dirty data left after unsuccessful updates
      notify_passenger if notifiable_status? && indicator_values_changed? && !booking.manual?
      notify_faye if any_changed?
      success!
    end

    private def key_values
      {
        service_type:   booking.service_type,
        vehicle_id:     booking.vehicle_id,
        status:         booking.status,
        driver_name:    booking.driver&.name,
        driver_lat:     booking.driver&.lat,
        driver_lng:     booking.driver&.lng,
        driver_bearing: booking.driver&.bearing,
        driver_eta:     booking.driver&.eta,
        driver_rating:  booking.driver&.trip_rating,
        scheduled_at:   booking.scheduled_at,
        address_ids:    booking_address_ids
      }
    end

    private def booking_address_ids
      [booking.pickup_address, *booking.stop_addresses, booking.destination_address].compact.map(&:id)
    end

    private def notifiable_status?
      booking.status.in? NOTIFIABLE_STATUSES
    end

    private def core_values_changed?
      any_changed?(:status, :scheduled_at, :address_ids)
    end

    private def indicator_values_changed?
      core_values_changed? || any_changed?(:driver_name)
    end

    private def any_changed?(*fields)
      fields = old_key_values.keys if fields.empty?

      old_key_values.values_at(*fields) != key_values.values_at(*fields)
    end

    private def notify_passenger
      NotifyPassenger.new(booking: booking).execute
    end

    private def notify_faye
      Faye.bookings.notify_update(booking,
        indicator:       indicator_values_changed?,
        live_modifier:   live_modifier || 0,
        future_modifier: future_modifier || 0
      )
    end

    private def live_modifier
      return unless any_changed?(:status)

      if booking.live? && !previous_status.in?(Booking::LIVE_STATUSES)
        1
      elsif !booking.live? && previous_status.in?(Booking::LIVE_STATUSES)
        -1
      end
    end

    private def future_modifier
      return unless any_changed?(:status)

      if booking.order_received?
        1
      elsif previous_status.order_received?
        -1
      end
    end

    private def previous_status
      old_key_values[:status].inquiry
    end
  end
end
