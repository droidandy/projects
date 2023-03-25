module Splyt
  class Update < ApplicationService
    include ApplicationService::Context

    attributes :booking

    def can_execute?
      booking.splyt?
    end

    def normalized_response
      driver_params.merge(booking_params)
    end

    def driver_params
      driver_info_api_service.normalized_response
    end

    def booking_params
      booking_info_api_service.normalized_response
    end

    private def execute!
      assert { driver_info_api_service.execute.success? }
      assert { booking_info_api_service.execute.success? }
      result { normalized_response }
    end

    private def driver_info_api_service
      @driver_info_api_service ||= ::Splyt::DriverInfo.new(booking: booking)
    end

    private def booking_info_api_service
      @booking_info_api_service ||= ::Splyt::BookingInfo.new(booking: booking)
    end
  end
end
