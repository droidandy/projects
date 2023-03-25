module Incomings
  module Splyt
    class EventHandler < ApplicationService
      BOOKING_UPDATED    = 'booking.status.updated'.freeze
      BOOKING_REASSIGNED = 'booking.vehicle.reassigned'.freeze
      PING               = 'ping'.freeze
      RECEIPT_CREATED    = 'booking.receipt.created'.freeze
      RECEIPT_UPDATED    = 'booking.receipt.updated'.freeze

      attributes :params

      private def execute!
        delegate_execution_to handler_service
      end

      private def handler_service
        case event_name
        when BOOKING_UPDATED
          BookingStatusUpdater.new(payload: params)
        when BOOKING_REASSIGNED
          BookingStatusUpdater.new(payload: vehicle_reassign_params)
        when PING
          DummyEventHandler.new
        when RECEIPT_CREATED, RECEIPT_UPDATED
          ReceiptHandler.new(payload: params)
        else
          raise "Splyt Event Handler for event #{event_name} not found"
        end
      end

      private def event_name
        params.fetch(:event).fetch(:name)
      end

      private def vehicle_reassign_params
        params.deep_merge(
          data: {
            status: 'reassigned'
          }
        )
      end
    end
  end
end
