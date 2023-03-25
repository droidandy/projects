module Bookings
  class NotifyPassenger < ApplicationService
    attributes :booking, :only, :force

    delegate :company_info, :booker, :passenger_info, :passenger, to: :booking
    delegate :company, to: :company_info
    delegate :booker_notifications?, :booker_notifications_emails, :enterprise?,
      :api_notifications_enabled?, to: :company

    def execute!
      return unless enterprise?

      notify_passenger_with_sms if notify_passenger_with_sms?
      notify_passenger_with_email if notify_passenger_with_email?
      notify_passenger_with_push if notify_passenger_with_push?
      notify_bookers_with_email if booker_notifications?

      success!
    end

    private def enabled?(notification)
      return false if booking.source_type&.api? && !api_notifications_enabled?

      only.nil? || Array(only).include?(notification)
    end

    private def notify_passenger_with_sms
      time = deliver_at || DateTime.current

      SmsSender.perform_at(time, passenger_info[:phone_number], message.sms)

      booking.add_change(:sms, "Passenger - #{booking.status.humanize}")
    end

    private def notify_passenger_with_email
      NotificationMailer.notify_passenger(booking, message.email).deliver_later(wait_until: deliver_at)
    end

    private def notify_passenger_with_push
      Bookings::PushNotification.new(
        booking:          booking,
        kind:             Bookings::PushNotification::BOOKING_STATUS_CHANGE,
        back_up_with_sms: passenger.notify_with_sms?
      ).execute
    end

    private def deliver_at
      return unless booking.status == 'on_the_way'

      scheduled_at = booking.scheduled_at.to_time
      return if ((scheduled_at.utc - Time.now.utc) / 1.hour).round <= 1

      scheduled_at - 1.hour
    end

    private def message
      @message ||= Message.new(booking: booking, delivered_at: deliver_at)
    end

    private def passenger_push_notifiable?
      passenger.present? && passenger.notify_with_push? && passenger.user_devices_dataset.active.any?
    end

    private def notify_passenger_with_sms?
      enabled?(:sms) && (
        passenger.blank? ||
        force? ||
        (passenger.notify_with_sms? && !passenger_push_notifiable?)
      )
    end

    private def notify_passenger_with_email?
      enabled?(:email) &&
        passenger.present? &&
        (force? || passenger.notify_with_email?)
    end

    private def notify_booker_with_email?(booker)
      enabled?(:email) &&
        booker.member? &&
        booker.id != passenger&.id &&
        (force? || booker.notify_with_email?)
    end

    private def notify_passenger_with_push?
      enabled?(:push) &&
        passenger.present? &&
        passenger.user_devices_dataset.active.any? &&
        (force? || passenger.notify_with_push?)
    end

    private def notify_bookers_with_email
      notify_booking_booker_with_email if notify_booker_with_email?(booker)
      notify_company_bookers_with_email
    end

    private def notify_booking_booker_with_email
      NotificationMailer.notify_booking_booker(booking, message.booker_email).deliver_later
    end

    private def notify_company_bookers_with_email
      booker_notifications_emails_array.each do |booker_email|
        booker = company.bookers_dataset.first(email: booker_email)

        next if booker.present? && !notify_booker_with_email?(booker)

        NotificationMailer.notify_company_booker(booking, booker_email, message.booker_email).deliver_later
      end
    end

    private def booker_notifications_emails_array
      (booker_notifications_emails || '').split(',').map(&:strip).uniq - [booker.email]
    end

    class Message
      DEFAULT_ETA = 2

      delegate :order_id, :pickup_address, :destination_address, :asap?, :scheduled_at, :status,
        :passenger, :passenger_info, :driver, :stop_addresses, :timezone, :as_directed?, :company, to: :booking

      attr_reader :booking, :delivered_at

      def initialize(booking:, delivered_at:)
        @booking = booking
        @delivered_at = delivered_at || DateTime.current
      end

      def email
        notification_message(for_sms: false, for_booker: false)
      end

      def booker_email
        notification_message(for_sms: false, for_booker: true)
      end

      def sms
        sanitize(notification_message(for_sms: true, for_booker: false))
      end

      private def short_link
        @short_link ||= ShortUrl.generate("/bookings/#{@booking.id}/summary")
      end

      private def driver_name
        driver.name.present? ? I18n.transliterate(driver.name, locale: :en) : 'N/A'
      end

      private def vehicle_plate
        driver.vehicle.license_plate
      end

      private def driver_phone
        driver.phone_number
      end

      private def driver_phv_license
        info_line('PHV License', driver.phv_license) if driver.phv_license.present?
      end

      private def vehicle_model
        driver.vehicle.model
      end

      private def notification_message(assigns)
        render_message(assigns) do
          case status
          when 'order_received'
            asap? ? asap_order_received_message : scheduled_order_received_message
          when 'on_the_way'
            on_the_way_message
          when 'arrived'
            arrived_message
          when 'cancelled'
            cancelled_message
          end
        end
      end

      private def render_message(assigns)
        assigns.each{ |key, value| instance_variable_set("@#{key}", value) }

        <<-CONTENT
          #{"Here is an update on the order you booked for #{passenger_info[:full_name]}." if @for_booker && !@for_sms}
          #{yield}
        CONTENT
      ensure
        assigns.each_key{ |key| remove_instance_variable("@#{key}") }
      end

      private def asap_order_received_message
        @for_sms ? asap_order_received_sms : asap_order_received_email
      end

      private def asap_order_received_sms
        <<~CONTENT
          We've received your Gett Business Solutions powered by One Transport order #{order_id}. We'll send you confirmation of your order once your
          driver has been allocated.
          #{link_block}
          If you have any queries about the order, please contact us on +44203 608 9312.
        CONTENT
      end

      private def asap_order_received_email
        <<~CONTENT
          #{header("We've received your order")}
          #{appeal}
          Great News! Your Gett Business Solutions powered by One Transport Order #{order_id} has been confirmed.
          <p>
            We'll send you confirmation of your order once your driver has been allocated.
          </p>
        CONTENT
      end

      private def scheduled_order_received_message
        @for_sms ? scheduled_order_received_sms : scheduled_order_received_email
      end

      private def scheduled_order_received_sms
        <<~CONTENT
          Great news! Your Gett Business Solutions powered by One Transport order has been confirmed. A taxi will
          arrive at #{pickup_address.line} on #{scheduled_at.in_time_zone(timezone).strftime('%d/%m/%Y %H:%M')}
          #{destination_line}. If you have any queries about
          the order, please contact us on 0345 155 0802.
        CONTENT
      end

      private def scheduled_order_received_email
        <<~CONTENT
          #{header("We've received your order")}
          #{appeal}
          Great News! Your Gett Business Solutions powered by One Transport #{@for_sms ? 'order' : "Order #{order_id}"} has been confirmed.
          <p>
            A taxi will arrive at #{pickup_address.line} on #{scheduled_at.in_time_zone(timezone).strftime('%d/%m/%Y %H:%M')}
            #{destination_line}.
          </p>
        CONTENT
      end

      private def on_the_way_message
        <<-CONTENT
          #{header('Your driver is on the way')}
          #{appeal}
          <p style="margin-bottom:50px;">Your driver for order #{order_id} will arrive at #{pickup_address.line} in #{estimated_time}.</p>
          #{info_line('Driver name', driver_name)}
          #{info_line('Driver phone', driver_phone)}
          #{info_line('Number plate', vehicle_plate)}
          #{driver_phv_license}
          <p style="margin-bottom:50px;" />
          #{link_block}
        CONTENT
      end

      private def arrived_message
        <<-CONTENT
          #{header('Your driver is here')}
          #{'Your driver is here!' if @for_sms}
          <p style="width:100%;margin: 0;text-align:center;color:#808080;font-size:20px;padding-bottom:50px;">#{pickup_address.line}</p>
          #{info_line('Order ID', order_id)}
          #{info_line('Driver name', driver_name)}
          #{info_line('Driver phone', driver_phone)}
          #{info_line('Number plate', vehicle_plate)}
          #{driver_phv_license}
          <p style="margin-top:50px;">Thank you for using Gett Business Solutions powered by One Transport! We hope you have a safe journey.</p>
          #{link_block}
        CONTENT
      end

      private def cancelled_message
        destination = as_directed? ? '' : " to #{destination_address.line}"

        <<-CONTENT
          #{header("Order #{order_id} has been cancelled")}
          #{appeal}
          <p>
            Your order #{order_id}#{@for_sms ? '' : " for a taxi#{destination}"}
            on #{scheduled_at.in_time_zone(timezone).strftime('%d/%m/%Y %H:%M')} has been successfully cancelled.
          </p>
          #{link_block}
        CONTENT
      end

      private def header(string)
        return if @for_sms

        <<-CONTENT
          <h1 style="width: 100%;margin: 0; text-align: center;font-weight: 300;font-size:30px;line-height: 1.13;color:#373737;padding:40px 0;">
            #{string}
          </h1>
        CONTENT
      end

      private def appeal
        "<p>Hi #{passenger.full_name},</p>" if passenger.present? && !@for_sms
      end

      private def info_line(field, value)
        <<~CONTENT
          <p style='line-height:1.71;margin:0;'>
            <span style='display:inline-block;color:#808080; width: 90px;margin-right:20px;font-size: 14px;'>
              #{field}:
            </span>
            <span style='font-size: 16px;'>#{value}</strong>
          </p>
        CONTENT
      end

      private def destination_line
        destination = as_directed? ? '' : "to take you to #{destination_address.line}"
        stop_points = (stop_addresses.present? && !@for_sms) ? " with stop points (#{stop_addresses.map(&:line).join(', ')})" : '.'

        destination << stop_points
      end

      private def link_block
        # @for_sms instance variable exists only for duration of `render_message` block in `notification_message` method.
        # consider it as a template variable used in rendering to get rid of passing it everywhere in all `_message` methods
        if @for_sms
          "Click #{short_link} to see more info about booking." if !@for_booker && passenger.present?
        else
          "<p>Please click #{ActionController::Base.helpers.link_to('here', short_link, style: 'font-weight: bold;')} to see more information about this booking.</p>"
        end
      end

      private def estimated_time
        unless booking.asap?
          return ActionController::Base.helpers.distance_of_time_in_words(booking.scheduled_at, delivered_at)
        end

        time_value = [driver_eta, DEFAULT_ETA].max

        ActionController::Base.helpers.pluralize(time_value, 'minute')
      end

      private def driver_eta
        @driver_eta ||= driver.eta.to_i
      end

      private def sanitize(string)
        string.gsub(%r{<.+?/?>}, ' ').squish
      end
    end
  end
end
