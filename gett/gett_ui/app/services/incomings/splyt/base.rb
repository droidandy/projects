module Incomings
  module Splyt
    class Base < ApplicationService
      include ::ApplicationService::ModelMethods

      attributes :payload

      def errors
        @errors ||= Errors.new
      end

      private def execute!
        transaction do
          success!

          if valid?
            yield
          else
            incoming.api_errors = errors
          end

          incoming.save
        end
      end

      private def incoming
        @incoming ||= Incoming.new(service_type: Bookings::Providers::SPLYT, payload: payload.to_h, booking: booking)
      end

      private def valid?
        errors.clear
        validate
        errors.empty?
      end

      private def booking
        return @booking if defined?(@booking)

        @booking = Booking.find(service_id: payload.dig(:data, :booking_id))
      end
    end

    class Errors < Hash
      def add(key, error)
        self[key] ||= []
        self[key] << I18n.t("#{Bookings::Providers::SPLYT}.#{key}.#{error}")
      end
    end
  end
end
