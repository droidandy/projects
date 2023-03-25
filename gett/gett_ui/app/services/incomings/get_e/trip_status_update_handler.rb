module Incomings
  module GetE
    class TripStatusUpdateHandler < Base
      include ::Bookings::Notificator::Concern

      STATUS_MAPPING = {
        'BOOKED'      => :order_received,
        'EN_ROUTE'    => :on_the_way,
        'AT_PICKUP'   => :arrived,
        'ON_BOARD'    => :in_progress,
        'IN_PROGRESS' => :in_progress,
        'COMPLETE'    => :completed,
        'CANCELLED'   => :cancelled
      }.freeze
      private_constant :STATUS_MAPPING

      def execute!
        super do
          booking.lock!
          notify_on_update do
            update_model(booking, booking_params)
          end
          Incomings::GetE::PriceUpdateHandler.new(payload: payload).execute if status == :completed
        end
      end

      private def validate
        errors.add(:booking, :not_found) if booking.blank?
      end

      private def status
        STATUS_MAPPING[payload.dig('data', 'StatusCode')]
      end

      private def booking_params
        params = { status: status }
        timestamp = Bookings::TIMESTAMP_MAPPING[status.to_sym]
        params[timestamp] = Time.current if timestamp.present?
        params
      end
    end
  end
end
