module Alerts
  class FlightChecker < ApplicationService
    ALERT_STATUSES = %w[
      flight_cancelled
      flight_diverted
      flight_redirected
      flight_delayed
    ].freeze

    OK_STATUSES = %w[
      flight_active
      flight_scheduled
    ].freeze

    private_constant :ALERT_STATUSES, :OK_STATUSES

    attributes :booking

    def execute!
      return if flight_status.blank?

      remove_alerts
      create_alert if ALERT_STATUSES.include?(flight_status)

      success!
    end

    private def remove_alerts
      Alerts::Remove.new(booking: booking, type: ALERT_STATUSES.without(flight_status)).execute
    end

    private def create_alert
      return if booking.alert_for(flight_status).present?

      Alerts::Create.new(booking: booking, type: flight_status).execute
      Bookings::PushNotification.new(
        booking:       booking,
        kind:          Bookings::PushNotification::FLIGHT_STATUS_CHANGE,
        flight_status: flight_status
      ).execute
    end

    private def flight_status
      return unless status_service.execute.success?

      status_service.result[:status]
    end

    private def status_service
      @status_service ||= Flightstats::Status.new(
        flight: booking.flight,
        year:   booking.scheduled_at.year,
        month:  booking.scheduled_at.month,
        day:    booking.scheduled_at.day
      )
    end
  end
end
