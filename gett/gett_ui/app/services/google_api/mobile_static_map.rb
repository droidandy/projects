module GoogleApi
  class MobileStaticMap < BaseStaticMap
    STOP_POINT_MARKER_PATH = ->(_) { "#{ASSET_HOST}/images/mailer/mobile_stop_point_marker.png" }
    MARKER_COLOR = "0x2B4983FF".freeze

    private def icon_path(type)
      "#{ASSET_HOST}/images/mobile_#{type}_marker.png"
    end

    private def credentials
      {}
    end
  end
end
