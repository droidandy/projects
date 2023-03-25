require 'base64'

module Bookings
  class ExportTimeline < ApplicationService
    attributes :booking

    QUALITY = 50
    FORMAT = :png
    private_constant :QUALITY, :FORMAT

    def execute!
      IMGKit.new(timeline_html, quality: QUALITY).to_img(FORMAT)
    end

    private def timeline_html
      BookingsController.render(
        template: 'bookings/timeline',
        layout: false,
        assigns: {booking_data: timeline_data}
      )
    end

    private def timeline_data
      Bookings::Timeline.new(booking: booking).execute.result
    end
  end
end
