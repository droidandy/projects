module GoogleApi
  class EmailStaticMap < BaseStaticMap
    STOP_POINT_MARKER_PATH = ->(i) { "#{ASSET_HOST}/images/mailer/stop-point-#{i}-small-size.png" }
    MARKER_COLOR = "0x5BACF7FF".freeze

    private def icon_path(type)
      "#{ASSET_HOST}/images/#{type}_marker.png"
    end
  end
end
