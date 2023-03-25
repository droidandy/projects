module Bookings
  class Row < ApplicationService
    include ApplicationService::Context
    include HomePrivacy::AddressHelpers

    # TODO: move `:map_size` to Mobile API namespace
    attributes :booking, :map_size

    delegate :company, :driver, :cancelled_by, :cancelled_through_back_office, :service_type, to: :booking
    delegate :member, to: :context

    def execute!
      booking.as_json(
        only: [
          :id,
          :service_id,
          :supplier_service_id,
          :status,
          :payment_method,
          :scheduled_at,
          :fare_quote,
          :recurring_next
        ],
        include: [:service_type, :indicated_status, :timezone, :journey_type]
      ).merge(
        order_id: booking.order_id,
        passenger: booking.passenger_info[:full_name],
        phone: booking.passenger_info[:phone_number],
        passenger_avatar_url: booking.passenger&.avatar&.url,
        pickup_address: pickup_address,
        destination_address: destination_address,
        vehicle_type: booking.vehicle.name,
        payment_method_title: I18n.t("payment_options.payment_types.#{booking.payment_method}"),
        final: booking.final?,
        alert_level: alert_level,
        eta: eta,
        can: {
          cancel: booking.cancellable?
        },
        via: vehicle_provider
      ).tap do |json|
        json['total_cost'] = booking.charges&.total_cost if booking.billable?
        json['static_map'] = static_map_service.execute.result if map_size.present?
      end
    end

    private def vehicle_provider
      if booking.via?
        'via'
      else
        service_type
      end
    end

    # TODO: move to Mobile API namespace
    private def static_map_service
      @static_map_service = GoogleApi::MobileStaticMap.new(
        booking: booking,
        size: map_size
      )
    end

    private def eta
      return if driver&.eta.blank?

      (driver.eta.to_i > 0) ? driver.eta.to_s : '< 1'
    end

    private def pickup_address
      safe_address_as_json(
        booking.pickup_address,
        skip_sanitize: member_is_a_passenger?,
        only: [:line, :lat, :lng]
      )
    end

    private def destination_address
      safe_address_as_json(
        booking.destination_address,
        skip_sanitize: member_is_a_passenger?,
        only: [:line, :lat, :lng]
      )
    end

    private def member_is_a_passenger?
      member&.id == booking.passenger_id
    end

    private def events
      ::Bookings::Events.new(booking: booking).execute.result
    end

    private def alert_level
      return 'critical' if alerts.any?(&:critical?)
      return 'medium' if alerts.any?(&:medium?)
    end

    private def alerts
      @alerts ||= booking.alerts.select{ |alert| !booking.customer_care? || alert.type != 'has_no_driver' }
    end

    private def cancelled_by_name
      if cancelled_by.present?
        cancelled_through_back_office ? 'Customer Care' : cancelled_by.full_name
      end
    end
  end
end
