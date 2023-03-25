module Alerts
  class BookingsChecker < ApplicationService
    attributes :booking

    delegate :driver, to: :booking

    ARRIVING_DELAY = 5.minutes.freeze
    TRACKING_DELAY = 3.minutes.freeze
    DRIVER_ASSIGNMENT_DELAY_ASAP = 5.minutes.freeze
    DRIVER_ASSIGNMENT_DELAY_FUTURE = 30.minutes.freeze
    private_constant :TRACKING_DELAY,
      :DRIVER_ASSIGNMENT_DELAY_FUTURE,
      :DRIVER_ASSIGNMENT_DELAY_ASAP,
      :ARRIVING_DELAY

    def execute!
      return if booking.processing? || booking.final?

      unless Bookings::Modify::NOTIFIABLE_STATUSES.include?(booking.status)
        remove_alert(:order_changed)
      end

      check_no_driver

      check_driver_is_late if booking.driver.present?
    end

    private def check_no_driver
      return remove_alert(:has_no_driver) if booking.driver.present?

      return if booking.alerts_dataset.has_no_driver.any?

      create_alert(:has_no_driver) if should_driver_already_be_assigned?
    end

    private def check_driver_is_late
      if booking.on_the_way?
        if booking.scheduled_at + ARRIVING_DELAY < Time.current
          create_alert(:driver_is_late)
        end
      else
        remove_alert(:driver_is_late)
      end
    end

    private def should_driver_already_be_assigned?
      return false if booking.manual?

      (booking.asap? && booking.created_at < DRIVER_ASSIGNMENT_DELAY_ASAP.ago) ||
        (!booking.asap? && booking.scheduled_at < DRIVER_ASSIGNMENT_DELAY_FUTURE.from_now)
    end

    private def create_alert(type)
      Alerts::Create.new(booking: booking, type: type).execute
    end

    private def remove_alert(type)
      Alerts::Remove.new(booking: booking, type: type).execute
    end
  end
end
