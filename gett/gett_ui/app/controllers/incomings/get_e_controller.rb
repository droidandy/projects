module Incomings
  class GetEController < AuthController
    DRIVER_UPDATE_EVENT = 'TRIP_DRIVER_UPDATE'.freeze
    PRICE_UPDATE_EVENT  = 'TRIP_PRICE_UPDATE'.freeze
    STATUS_UPDATE_EVENT = 'TRIP_STATUS_UPDATE'.freeze
    TRIP_POSITION_UPDATE_EVENT = 'TRIP_POSITION_UPDATE'.freeze

    def create
      case event_name
      when DRIVER_UPDATE_EVENT
        Incomings::GetE::DriverUpdateHandler.new(payload: payload).execute
      when PRICE_UPDATE_EVENT
        Incomings::GetE::PriceUpdateHandler.new(payload: payload).execute
      when STATUS_UPDATE_EVENT
        Incomings::GetE::TripStatusUpdateHandler.new(payload: payload).execute
      when TRIP_POSITION_UPDATE_EVENT
        Incomings::GetE::TripPositionUpdateHandler.new(payload: payload).execute
      end
      head :ok
    end

    private def access_token
      Settings.get_e.access_token
    end

    private def event_name
      # for TRIP_POSITION_UPDATE api will send event name as a string in key 'event'
      params[:event].is_a?(String) ? params[:event] : params[:event][:name]
    end

    private def payload
      params.permit!.except(:controller, :action).to_h.with_indifferent_access
    end
  end
end
