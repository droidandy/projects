module Drivers
  class FetchChannel < ApplicationService
    include ApplicationService::ModelMethods
    include ApplicationService::RestMethods
    include ApplicationService::Context

    attributes :params

    delegate :company, to: :context
    delegate :address, to: :company, prefix: true

    def execute!
      save_model(channel, valid_until: 1.minute.from_now)

      channel.channel
    end

    def channel
      @channel ||= DriversChannel.in_close_vicinity_to(location_coords) || build_channel
    end

    private def location_coords
      @location_coords ||=
        if params.present? && params[:lat] && params[:lng]
          { lat: params[:lat], lng: params[:lng] }
        else
          { lat: company_address.lat, lng: company_address.lng }
        end
    end

    private def country_code
      params&.dig(:country_code) || company_address.country_code
    end

    private def build_channel
      channel_key = Faye.channelize("drivers-map-#{location_coords[:lat]}-#{location_coords[:lng]}")
      DriversChannel.create(
        channel: channel_key,
        country_code: country_code,
        location: [location_coords[:lat], location_coords[:lng]],
        valid_until: 1.minute.from_now
      )
    end
  end
end
