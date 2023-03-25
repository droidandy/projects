module GoogleApi
  class CardReceiptStaticMap < BaseStaticMap
    STOP_POINT_MARKER_PATH = ->(_) { "#{ASSET_HOST}/images/mailer/card_receipt_stop_point_marker_small.png" }
    MARKER_COLOR = "0x2B4983FF".freeze

    private def icon_path(type)
      "#{ASSET_HOST}/images/card_receipt_#{type}_marker_small.png"
    end
  end
end
