module Bookings
  class CreateRequest < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::FailSafe
    include Notificator::Concern

    attributes :booking, :metadata

    delegate :company, to: :booking
    delegate :price_with_fx_rate_increase, to: :company

    def execute!
      if booking_cancelled_before_creating?
        notify_on_update do
          update_model(booking, status: 'cancelled', cancelled_at: Time.current, customer_care_message: nil)
        end
        return
      end

      api_service.execute do |on|
        on.success do
          fail_safe(subject: booking, retry: {Sequel::PoolTimeout => 5}) do
            booking.reload
            notify_on_update do
              update_model(booking, updated_params)

              # NOTE: by https://gett-uk.atlassian.net/browse/OU-615 "Edit" and "Cancel"
              # buttons for OT orders are disabled for 2 minutes after booking created, making
              # it actually impossible to try to cancel a booking while it was creating for OT
              if booking_cancelled_while_creating?
                BookingsServiceJob.perform_later(booking, 'Bookings::Cancel')
                return # rubocop:disable Lint/NonLocalExitFromIterator
              end

              send_bbc_emails if company.bbc?

              BookingsUpdater.updater_for(booking)&.perform_scheduled(booking.id) if booking.asap?
            end
          end

          BookingsChargesUpdater.perform_async(booking.id) if booking.manual?
        end

        on.failure do |_response, error_message|
          update_model(booking, customer_care_message: error_message) if error_message.present?

          fail ServiceProviderError, "Cannot create booking via #{api_service.class.parent} API"
        end
      end
    end

    private def api_service
      @api_service ||= Bookings.service_for(booking, :create)
    end

    private def booking_cancelled_before_creating?
      booking.creating? && booking.cancellation_requested_at.present?
    end

    private def booking_cancelled_while_creating?
      booking.cancellation_requested_at.present?
    end

    private def send_bbc_emails
      return if metadata.blank?

      ['ride_over_mileage_limit_email', 'ride_outside_lnemt_email'].each do |mail_type|
        next unless metadata.key?(mail_type)

        BbcNotificationsMailer.public_send(
          mail_type.to_sym,
          booking: booking,
          **metadata[mail_type].symbolize_keys
        ).deliver_later
      end
    end

    private def updated_params
      api_service.normalized_response.tap do |json|
        json[:booked_at] = Time.current
        json[:status] = :order_received
        json[:customer_care_message] = nil
        if json[:fare_quote].present?
          json[:fare_quote] = price_with_fx_rate_increase(json[:fare_quote], international: booking.international?)
        end
      end
    end
  end
end
