module Incomings
  module GetE
    class Base < ApplicationService
      include ::ApplicationService::ModelMethods

      attributes :payload

      def execute!
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

      def incoming
        @incoming ||=
          Incoming.new(service_type: 'get_e', payload: payload) do |i|
            i.booking = booking
          end
      end

      private def valid?
        errors.clear
        validate
        errors.empty?
      end

      def errors
        @errors ||= Errors.new
      end

      private def booking
        return @booking if defined?(@booking)

        @booking = Booking.find(service_id: payload[:data][:Unid].to_s)
      end
    end

    class Errors < Hash
      def add(key, error)
        self[key] ||= []
        self[key] << I18n.t("get_e.#{key}.#{error}")
      end
    end
  end
end
